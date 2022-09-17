<script>
	//svelte
	import { onDestroy, onMount } from 'svelte';
	import { xlink_attr } from 'svelte/internal';

	//Components
	import Group from '$lib/components/Group.svelte';
	import Text from '$lib/components/Text.svelte';
	import LargeText from '$lib/components/LargeText.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import EmbeddedContent from '$lib/components/EmbeddedContent.svelte';
	import Media from '$lib/components/Media.svelte';
	import Reference from '$lib/components/Reference.svelte';
	import Boolean from '$lib/components/Boolean.svelte';
	import Date from '$lib/components/Date.svelte';
	
	//Global Form Configuration
	let isMounted = false;

	//Form
	let formSDK;
	let type;
	let groups;
	let item;
	let itemProps;
	let repositoryId;
	let fields;
	let locale;
	let defaultLang;
	let isNew = true;
	let availableLanguages;
	
	//Content type Asset Configuration
	let contentTypeStructure = {};


	onMount(async () => {
		// this is the entry point to initialize the form sdk.
		if (window.contentFormSDK) {
			console.log('[Content Form SDK]',window.contentFormSDK);
			await window.contentFormSDK.init(initFormNew);
		}
	});

	/**
	 * initFormNew
	 **/
	function initFormNew(sdk) {
		console.log('[initFormNew sdk]',sdk);
		//sometimes double call is triggered using this hack
		if (isMounted) {
			return;
		}

		//define global
		formSDK = sdk;

		// type
		type = formSDK.getType();
		console.log('[type]', type);

		//get groups
		groups = type.getGroups();
		console.log('[groups]', groups);

		// item being rendered in the form
		item = formSDK.getItem();
		console.log('[item]', item);

		//item properties
		itemProps = item.get();
		console.log('[item props]', itemProps);

		//quick set repo id
		repositoryId = itemProps.repositoryId;

		// fields of the item
		fields = item.getFields();
		console.log('[fields]', fields);

		// Generate loopable structure
		updateContentTypeStore(itemProps, groups, fields);

		// current locale of the UI
		locale = formSDK.getLocale();
		console.log('[User locale]', locale);
		
		// repository's  default language
		defaultLang = formSDK.getRepositoryDefaultLanguage();
		console.log('[Repo Default Lang]', defaultLang);

		//is a new asset being created
		isNew = item.isNew();


		//show language field if new item
		if (isNew) {
			console.log('[New Asset]');

			//add additional check to set content as translatable
			if (itemProps.languageIsMaster) {
				//enable/force asset as translatable
				item.setTranslatable(true, {silent: true});
			//setup default lang if translations not available - enables use to force selection
			} else {
				item.setLanguage(defaultLang, { silent: true });
			}

			//get avaiable language list
			availableLanguages = item.getLanguageOptions();
			console.log('[availableLanguages]', availableLanguages);
		//updating asset
		} else {

		}
		
		//setup callback to validate form if users selects OCE Save option
		sdk.registerFormValidation(validateForm);

		//sync up item properties when item is updated
		item.on('update', (props) => {
			itemProps = props;
			
		});
		
		//page ready
		isMounted = true;
	}

	/**
	 * updateContentTypeStore
	 * prep and refresh store
	 **/
	 function updateContentTypeStore(itemProps, groups, fields) {
		console.log('[updateContentTypeStore]', itemProps, groups, fields);

		//setup core content type structure
		contentTypeStructure = itemProps;
		contentTypeStructure.groups = groups;
		contentTypeStructure.fields = {};
		contentTypeStructure.required = [];

		//loop groups and create empty fields arr 
		if (groups) {
			groups.forEach((group,groupIndex) => {
				contentTypeStructure.groups[groupIndex].fields = [];
			});
		}

		//loop fields and create easy accessible structure
		fields.forEach((field) => {
			const fieldProps = field.getDefinition();
			
			//add required field
			if (fieldProps.required) {
				contentTypeStructure.required.push(fieldProps.name);
			}

			//push field
			contentTypeStructure.fields[fieldProps.name] = fieldProps;

			//set groupIndex
			const groupIndex = ((fieldProps.settings) && (fieldProps.settings.groupIndex))? fieldProps.settings.groupIndex: 0;
		
			//define field belongs to which group index
			contentTypeStructure.groups[groupIndex].fields.push(fieldProps.name);
			
		});

		//field keys
		contentTypeStructure.fieldKeys = Object.keys(contentTypeStructure.fields);

		//update store
		console.log('[contentTypeStructure]',contentTypeStructure);
	}


	/**
	 * validateForm
	 */
	function validateForm() {
		console.log('[validateForm]');

	}

	/**
	 * handleSubmit
	 * form submit empty 
	 */
	function handleSubmit() {

	} 

</script>

<section class="columns-1 gap-8 flex flex-1">
	<!-- Info Panel 
	<article class="columns-1 p-4 bg-slate-900 rounded-lg  flex-1">1</article>
	 xInfo Panel -->

	<!-- Form Panel -->
	<article class="flex flex-1 min-w-[640px] items-center flex justify-center">
		<form class="flex-1 max-w-[640px]" on:submit|preventDefault={handleSubmit}>
			<h1 class="font-semibold text-lg mt-4">Content Item Properties</h1>
			<!-- Generate Content Fields -->
			{#if (contentTypeStructure.groups)}
				<!-- Primary Fields-->
				<Group>
					<dt slot="title"></dt>
					<dd slot="content" class="mt-8">
						<div class="grid grid-cols-1 gap-6">
							<!-- Asset Name -->
							<Text
								required="{true}"
								label="Asset Name"
								placeholder="Content item name" />
							<!-- xAsset Name -->

							<!-- Description -->
							<LargeText 
								required="{false}"
								label="Asset Name"
								placeholder="Content item name" />
							<!-- xDescription -->

							<!-- Slug -->
							<Text
								required="{true}"
								label="Slug"
								placeholder="Unique Content Item Identifier" />
							<!-- xSlug -->
							
							<!-- Language -->
							{#if (isNew)}
								<Text
									type="Single-select menu"
									required="{true}"
									label="Language"
									items="{availableLanguages}" />
							{/if}
							<!-- xLanguage -->
						</div>
					</dd>
				</Group>
				<!-- xPrimary Fields-->

				<Divider />

				<!-- Loop through Groups -->
				{#each contentTypeStructure.groups as group}
					<!-- Loop fields associated with group -->
					{#if ((group.fields) && (group.fields.length > 0))}
						<Group isCard={true}>
							<dt slot="title" class="p-4 font-semibold border-b border-grey">{group.title}</dt>
							<dd slot="content" class="p-4">
								<div class="grid grid-cols-1 gap-6">
									{#each group.fields as field}
										<!-- Text Field -->
										{#if (contentTypeStructure.fields[field].datatype === 'text')}
											<Text
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}"
												placeholder="{contentTypeStructure.fields[field].settings.caas.description}" />
										{/if}
										<!-- xText Field -->

										<!-- LargeText Field -->
										{#if (contentTypeStructure.fields[field].datatype === 'largetext')}
											<LargeText 
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}"
												placeholder="{contentTypeStructure.fields[field].settings.caas.description}" />
										{/if}
										<!-- xLargeText Field -->
										
										<!-- JSON Field -->
										{#if (contentTypeStructure.fields[field].datatype === 'json')}
											<EmbeddedContent 
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}" />
										{/if}
										<!-- xJSON Field -->
										
										<!-- Reference Content Type -->
										{#if ((contentTypeStructure.fields[field].datatype === 'reference') && (contentTypeStructure.fields[field].referenceType.typeCategory === 'ContentType'))}
											<Reference 
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}"
												description="{contentTypeStructure.fields[field].settings.caas.description}" />
										{/if}
										<!-- xReference Content Type -->
										
										<!-- Reference Media Type -->
										{#if ((contentTypeStructure.fields[field].datatype === 'reference') && (contentTypeStructure.fields[field].referenceType.typeCategory === 'DigitalAssetType'))}
											<Media 
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}"
												description="{contentTypeStructure.fields[field].settings.caas.description}" />
										{/if}
										<!-- xReference Media Type -->

										<!-- Toggle -->
										{#if (contentTypeStructure.fields[field].datatype === 'boolean')}
											<Boolean 
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}"
												description="{contentTypeStructure.fields[field].settings.caas.description}" />
										{/if}
										<!-- Toggle -->

										<!-- datetime -->
										{#if (contentTypeStructure.fields[field].datatype === 'datetime')}
											<Date 
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}"
												description="{contentTypeStructure.fields[field].settings.caas.description}" />
										{/if}
										<!-- datetime -->
									{/each}
								</div>
							</dd>
						</Group>
					{/if}
					<!-- xLoop fields associated with group -->
				{/each}
				<!-- xLoop through Groups -->
			{/if}
		</form>	
	</article>
	<!-- xForm Panel -->
</section>


<style>
</style>
