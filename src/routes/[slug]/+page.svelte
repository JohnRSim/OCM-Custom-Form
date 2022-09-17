<script>
	//svelte
	import { onDestroy, onMount } from 'svelte';
	import { xlink_attr } from 'svelte/internal';
	
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
	<article class="flex flex-1 min-w-[448px] items-center flex justify-center">
		<form class="flex-1 max-w-[448px]" on:submit|preventDefault={handleSubmit}>
			<h1 class="font-semibold text-lg mt-4">Content Item Properties</h1>
			<!-- Generate Content Fields -->
			{#if (contentTypeStructure.groups)}
				<!-- Primary Fields-->
				<dl>
					<dt></dt>
					<dd class="mt-8">
						<div class="grid grid-cols-1 gap-6">
							<!-- Asset Name -->
							<label class="block">
								<span class="text-gray-700 font-medium">Asset Name *</span>
								<input
									type="text"
									class="
									mt-1
									block
									w-full
									rounded-md
									border-gray-300
									shadow-sm
									focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
								"
									placeholder="Content item name"
								/>
							</label>
							<!-- xAsset Name -->

							<!-- Description -->
							<label class="block">
								<span class="text-gray-700 font-medium">Description</span>
								<textarea
									class="
									mt-1
									block
									w-full
									rounded-md
									border-gray-300
									shadow-sm
									focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
								"
									rows="3"
									placeholder="Content item description"
								/>
							</label>
							<!-- xDescription -->

							<!-- Slug -->
							<label class="block">
								<span class="text-gray-700 font-medium">Slug *</span>
								<input
									type="text"
									class="
									mt-1
									block
									w-full
									rounded-md
									border-gray-300
									shadow-sm
									focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
								"
									placeholder="Unique Content Item Identifier"
								/>
							</label>
							<!-- xSlug -->
							
							<!-- Language -->
							{#if (isNew)}
							<label class="block">
								<span class="text-gray-700 font-medium">Language *</span>
								<select
									class="
									block
									w-full
									mt-1
									rounded-md
									border-gray-300
									shadow-sm
									focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
								"
								>
								{#each availableLanguages as language}
									<option value="{language.value}">{language.label}</option>
								{/each}
								</select>
							</label>
							{/if}
							<!-- xLanguage -->
						</div>
					</dd>
				</dl>
				<!-- xPrimary Fields-->
				<hr class="border-2 border-slate-500 cursor-pointer rounded-xl mt-6 mb-6" />
				<!-- Loop through Groups -->
				{#each contentTypeStructure.groups as group}
					<!-- Loop fields associated with group -->
					{#if ((group.fields) && (group.fields.length > 0))}
						<dl class="shadow-md rounded-xl mt-4 mb-10 bg-white">
							<dt class="p-4 font-semibold border-b border-grey">{group.title}</dt>
											
							<dd class="p-4">
								<div class="grid grid-cols-1 gap-6">
									{#each group.fields as field}
										<!-- Text Field -->
										{#if (contentTypeStructure.fields[field].datatype === 'text')}
											<label class="block">
												<span class="text-gray-700 font-medium">
													{contentTypeStructure.fields[field].description}
													{#if (contentTypeStructure.fields[field].required)}
														*
													{/if}
												</span>
												<input
													type="text"
													class="
													mt-1
													block
													w-full
													rounded-md
													border-gray-300
													shadow-sm
													focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
												"
													placeholder="{contentTypeStructure.fields[field].settings.caas.description}"
												/>
											</label>
										{/if}
										<!-- xText Field -->

										<!-- LargeText Field -->
										{#if (contentTypeStructure.fields[field].datatype === 'largetext')}
											<label class="block">
												<span class="text-gray-700 font-medium">
													{contentTypeStructure.fields[field].description}
													{#if (contentTypeStructure.fields[field].required)}
														*
													{/if}
												</span>
												<textarea
													class="
													mt-1
													block
													w-full
													rounded-md
													border-gray-300
													shadow-sm
													focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
												"
													placeholder="{contentTypeStructure.fields[field].settings.caas.description}"
													rows="3"
												/>
											</label>
										{/if}
										<!-- xLargeText Field -->
										
										<!-- JSON Field -->
										{#if (contentTypeStructure.fields[field].datatype === 'json')}
											<label class="block">
												<span class="text-gray-700 font-medium">
													{contentTypeStructure.fields[field].description}
													{#if (contentTypeStructure.fields[field].required)}
														*
													{/if}
												</span>
												<textarea
													class="
													mt-1
													block
													w-full
													rounded-md
													border-gray-300
													shadow-sm
													focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
												"
													rows="3"
												/>
											</label>
										{/if}
										<!-- xJSON Field -->
										
										<!-- Reference Content Type -->
										{#if (contentTypeStructure.fields[field].datatype === 'reference')}
											<div>{contentTypeStructure.fields[field].description}</div>
										{/if}
										<!-- xReference Content Type -->
										
										<!-- Reference Media Type -->
										{#if (contentTypeStructure.fields[field].datatype === 'reference')}
											<div>{contentTypeStructure.fields[field].description}</div>
										{/if}
										<!-- xReference Media Type -->

										<!-- Toggle -->
										{#if (contentTypeStructure.fields[field].datatype === 'boolean')}
											<label class="block">
												<span class="text-gray-700 font-medium">
													{contentTypeStructure.fields[field].description}
													{#if (contentTypeStructure.fields[field].required)}
														*
													{/if}
												</span>
												<div class="pointer-events-auto h-6 w-10 rounded-full p-1 ring-1 ring-inset transition duration-200 ease-in-out bg-slate-900/10 ring-slate-900/5"><div class="h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 transition duration-200 ease-in-out"></div></div>
											</label>
										{/if}
										<!-- Toggle -->

										<!-- datetime -->
										{#if (contentTypeStructure.fields[field].datatype === 'datetime')}
											
											<label class="block">
												<span class="text-gray-700 font-medium">
													{contentTypeStructure.fields[field].description}
													{#if (contentTypeStructure.fields[field].required)}
														*
													{/if}
												</span>
												<input
													type="date"
													class="
													mt-1
													block
													w-full
													rounded-md
													border-gray-300
													shadow-sm
													focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
												"
												/>
											</label>
										{/if}
										<!-- datetime -->
									{/each}
								</div>
							</dd>
						</dl>
					{/if}
					<!-- xLoop fields associated with group -->
				{/each}
				<!-- xLoop through Groups -->
			{/if}
	
	<!--
					<label class="block">
						<span class="text-gray-700">Full name</span>
						<input
							type="text"
							class="
							mt-1
							block
							w-full
							rounded-md
							border-gray-300
							shadow-sm
							focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
						"
							placeholder=""
						/>
					</label>
					<label class="block">
						<span class="text-gray-700">Email address</span>
						<input
							type="email"
							class="
							mt-1
							block
							w-full
							rounded-md
							border-gray-300
							shadow-sm
							focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
						"
							placeholder="john@example.com"
						/>
					</label>
					<label class="block">
						<span class="text-gray-700">When is your event?</span>
						<input
							type="date"
							class="
							mt-1
							block
							w-full
							rounded-md
							border-gray-300
							shadow-sm
							focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
						"
						/>
					</label>
					<label class="block">
						<span class="text-gray-700">What type of event is it?</span>
						<select
							class="
							block
							w-full
							mt-1
							rounded-md
							border-gray-300
							shadow-sm
							focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
						"
						>
							<option>Corporate event</option>
							<option>Wedding</option>
							<option>Birthday</option>
							<option>Other</option>
						</select>
					</label>
					<label class="block">
						<span class="text-gray-700">Additional details</span>
						<textarea
							class="
							mt-1
							block
							w-full
							rounded-md
							border-gray-300
							shadow-sm
							focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
						"
							rows="3"
						/>
					</label>
					<div class="block">
						<div class="mt-2">
							<div>
								<label class="inline-flex items-center">
									<input
										type="checkbox"
										class="
								rounded
								border-gray-300
								text-indigo-600
								shadow-sm
								focus:border-indigo-300
								focus:ring
								focus:ring-offset-0
								focus:ring-indigo-200
								focus:ring-opacity-50
								"
										checked
									/>
									<span class="ml-2">Email me news and special offers</span>
								</label>
							</div>
						</div>
			</div>-->
		</form>	
	</article>
	<!-- xForm Panel -->
</section>


<style>
</style>
