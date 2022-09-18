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
	import Label from '$lib/components/Label.svelte';
	import Number from '$lib/components/Number.svelte';
	import Decimal from '$lib/components/Decimal.svelte';
	
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
	let slug;
	let enableDescription = true;

	//store data
	let itemData = {};
	
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

		//get slug
		slug = type.getSlug();
		console.log('[slug]', slug);

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

		// Set store FieldValues
		setItemData();

		// Generate loopable structure
		updateContentTypeStore(itemProps, groups, fields);

		// current locale of the UI
		locale = formSDK.getLocale();
		console.log('[User locale]', locale);
		
		// repository's  default language
		defaultLang = formSDK.getRepositoryDefaultLanguage();
		console.log('[Repo Default Lang]', defaultLang);

		//check if description can be set
		//enableDescription = item.setDescription();

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
			itemData['assetName'] = itemProps.name;
			itemData['description'] = itemProps.description;
			itemData['slug'] = itemProps.slug;
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
	 * setItemData
	 **/
	 function setItemData() {
		console.log('[setItemData]');
		fields.forEach((field) => {
			if (field.getDefinition().datatype === 'json') {
				itemData[field.getDefinition().name] = JSON.stringify(field.getValue());
			} else {
				itemData[field.getDefinition().name] = field.getValue();
			}
		});
		console.log('[ItemData]',itemData);
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

	/**
	 * updateField
	 **/
	 function updateField(props) { 
		console.log('[updateField]',props);

		let value = props.value;

		if (props.multi) {
			let updateList = [];
			if (props.add) {
				//check if value set as array
				if (!Array.isArray(itemData[props.name])) {
					itemData[props.name] = [];
				}

				//loop through check if id defined and update else add item
				let updated = false;
				itemData[props.name].forEach((item,i) => {
					if (item.id === value.id) {
						itemData[props.name][i] = value;
						updated = true;
					}
				});

				if (!updated) {
					updateList = itemData[props.name];
					updateList.push(value);
					itemData[props.name] = [];
					itemData[props.name] = updateList;
				}
			} else {
				//create new array remove by id and update..
				//todo swap to reduce..?
				itemData[props.name].forEach((item) => {
					if (item.id !== value.id) {
						updateList.push(item);
					}
				});

				itemData[props.name] = updateList;
			}
		} else {
			itemData[props.name] = value;
		}

		//set Field Value
		setFieldValue(props.name, itemData[props.name]);
	}

	
	/**
	 * Set field value
	 **/
	 function setFieldValue(name, value) {
		console.log('[setFieldValue]',name,value);

		//Doesn't work with CEC Develop add fix
		if (window.location.hostname !== 'localhost') {
			console.log('[setFieldValue]', name, value);
			
			//update assetLang
			if (name === 'assetLanguage') {
				item.setLanguage(value, { silent: true });
			//update assetName
			} else if (name === 'assetName') {
				const activeTitle = value.replace(/[&\/\\#,+()$~%'":;*?<>{}]/g,'');
				item.setName(activeTitle.substring(0,256));
			//update description
			} else if (name === 'description') {
				const activeTitle = value.replace(/[&\/\\#,+()$~%'":;*?<>{}]/g,'');
				item.setDescription(activeTitle.substring(0,128));
			//update slug
			} else if (name === 'slug') {
				const activeTitle = value.replace(/[&\/\\#,+()@$~%.='":;*?<>{}\s]/g,'');
				item.setSlug(activeTitle.substring(0,250));
			//update field
			} else {
				console.log(item.getFieldByName(name));
				const getField = item.getFieldByName(name);
				const def = getField.getDefinition();

				getField.setValue(value);
			}
		}
		console.log(itemData)
	}
</script>

{#if (isMounted)}
<section class="columns-1 gap-8 flex flex-1">
	<!-- Info Panel 
	<article class="columns-1 p-4 bg-slate-900 rounded-lg  flex-1">1</article>
	 xInfo Panel -->

	<!-- Form Panel -->
	<article class="flex flex-1 min-w-[640px] flex justify-center">
		<form class="flex-1 max-w-[640px]" on:submit|preventDefault={handleSubmit}>
			<h1 class="font-semibold text-lg mt-4">Content Item Properties</h1>
			<!-- Generate Content Fields -->
			{#if (contentTypeStructure.groups)}
				<!-- Primary Fields-->
				<Group>
					<div slot="content">
						<div class="grid grid-cols-1 gap-6">
							<!-- Asset Name -->
							<Label
								required="{true}"
								label="Asset Name">
								<Text 
									on:updateField="{(e) => { updateField(e.detail); }}"
									focus="{true}"
									fieldName="assetName"
									placeholder="Content item name"
									activeValue="{itemData['assetName']}" />
							</Label>
							<!-- xAsset Name -->

							<!-- Description -->
							{#if (enableDescription)}
								<Label
									required="{false}"
									label="Description">
									<LargeText 
										on:updateField="{(e) => { updateField(e.detail); }}"
										fieldName="description"
										placeholder="Content item description"
										activeValue="{itemData['description']}" />
								</Label>
							{/if}
							<!-- xDescription -->

							<!-- Slug -->
							{#if ((slug) && (slug.enabled))}
								<Label
									required="{true}"
									label="Slug">
									<Text 
										on:updateField="{(e) => { updateField(e.detail); }}"
										patttern="{slug.pattern}"
										fieldName="slug"
										placeholder="Unique Content Item Identifier"
										activeValue="{itemData['slug']}" />
								</Label>
							{/if}
							<!-- xSlug -->
							
							<!-- Language -->
							{#if (isNew)}
								<Label
									required="{true}"
									label="Language">
									<Text
										on:updateField="{(e) => { updateField(e.detail); }}"
										fieldName="assetLanguage"
										type="Single-select menu"
										required="{true}"
										label="Language"
										items="{availableLanguages}"
										defaultValue="{defaultLang}" />
								</Label>
							{/if}
							<!-- xLanguage -->
						</div>
					</div>
				</Group>
				<!-- xPrimary Fields-->

				<!-- Divider-->
				<Divider />
				<!-- xDivider-->

				<!-- Loop through Groups and asset configured fields -->
				{#each contentTypeStructure.groups as group}
					<!-- Loop fields associated with group -->
					{#if ((group.fields) && (group.fields.length > 0) && (!group.hidden))}
						<Group 
							collapse="{group.collapse}"
							title="{group.title}"
							isCard={true}>
							<div slot="content">
								<div class="grid grid-cols-1 gap-6">
									{#each group.fields as field}
										<!-- Text Field -->
										{#if (contentTypeStructure.fields[field].datatype === 'text')}
											<Label
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}">
												<Text
													on:updateField="{(e) => { updateField(e.detail); }}"
													fieldName="{field}" 
													placeholder="{contentTypeStructure.fields[field].settings.caas.description}"
													activeValue="{itemData[field]}" />
											</Label>
										{/if}
										<!-- xText Field -->

										<!-- LargeText Field -->
										{#if (contentTypeStructure.fields[field].datatype === 'largetext')}
											<Label
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}">
												<LargeText 
													on:updateField="{(e) => { updateField(e.detail); }}"
													fieldName="{field}" 
													placeholder="{contentTypeStructure.fields[field].settings.caas.description}"
													activeValue="{itemData[field]}"  />
											</Label>
										{/if}
										<!-- xLargeText Field -->
										
										<!-- Reference Media Type -->
										{#if ((contentTypeStructure.fields[field].datatype === 'reference') && (contentTypeStructure.fields[field].referenceType.typeCategory === 'DigitalAssetType'))}
											<Label
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}">
												<Media 
													on:updateField="{(e) => { updateField(e.detail); }}"
													fieldName="{field}" 
													description="{contentTypeStructure.fields[field].settings.caas.description}"
													activeValue="{itemData[field]}"  />
											</Label>
										{/if}
										<!-- xReference Media Type -->

										<!-- Reference Content Type -->
										{#if ((contentTypeStructure.fields[field].datatype === 'reference') && (contentTypeStructure.fields[field].referenceType.typeCategory === 'ContentType'))}
											<Label
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}">
												<Reference 
													on:updateField="{(e) => { updateField(e.detail); }}"
													fieldName="{field}" 
													description="{contentTypeStructure.fields[field].settings.caas.description}"
													activeValue="{itemData[field]}"  />
											</Label>
										{/if}
										<!-- xReference Content Type -->

										<!-- Datetime -->
										{#if (contentTypeStructure.fields[field].datatype === 'datetime')}
											<Label
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}">
												<Date 
													on:updateField="{(e) => { updateField(e.detail); }}"
													fieldName="{field}" 
													description="{contentTypeStructure.fields[field].settings.caas.description}"
													activeValue="{itemData[field]}"  />
											</Label>
										{/if}
										<!-- xDatetime -->

										<!-- Number -->
										{#if (contentTypeStructure.fields[field].datatype === 'number')}
											<Label
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}">
												<Number 
													on:updateField="{(e) => { updateField(e.detail); }}"
													fieldName="{field}" 
													description="{contentTypeStructure.fields[field].settings.caas.description}"
													activeValue="{itemData[field]}"  />
											</Label>
										{/if}
										<!-- xNumber -->

										<!-- Decimal -->
										{#if (contentTypeStructure.fields[field].datatype === 'decimal')}
											<Label
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}">
												<Decimal 
													on:updateField="{(e) => { updateField(e.detail); }}"
													fieldName="{field}" 
													description="{contentTypeStructure.fields[field].settings.caas.description}"
													activeValue="{itemData[field]}"  />
											</Label>
										{/if}
										<!-- xDecimal -->
										
										<!-- Boolean -->
										{#if (contentTypeStructure.fields[field].datatype === 'boolean')}
											<Label
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}">
												<Boolean 
													on:updateField="{(e) => { updateField(e.detail); }}"
													fieldName="{field}" 
													defaultValue="{contentTypeStructure.fields[field].defaultValue}"
													labels="{contentTypeStructure.fields[field].settings.caas.editor.options.labels}"
													description="{contentTypeStructure.fields[field].settings.caas.description}"
													activeValue="{itemData[field]}"  />
											</Label>
										{/if}
										<!-- Boolean -->
										
										<!-- EmbeddedContent -->
										{#if (contentTypeStructure.fields[field].datatype === 'json')}
											<Label
												on:updateField="{(e) => { updateField(e.detail); }}"
												required="{contentTypeStructure.fields[field].required}"
												label="{contentTypeStructure.fields[field].description}">
												<EmbeddedContent 
													fieldName="{field}" 
													activeValue="{itemData[field]}"  />
											</Label>
										{/if}
										<!-- xEmbeddedContent -->
									{/each}
								</div>
							</div>
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
{/if}

<style>
</style>
