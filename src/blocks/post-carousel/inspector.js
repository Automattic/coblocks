/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';

import {
	PanelBody,
	ToggleControl,
	RangeControl,
	QueryControls,
	RadioControl,
} from '@wordpress/components';

class Inspector extends Component {
	render() {
		const {
			attributes,
			categoriesList,
			hasPosts,
			postCount,
			setAttributes,
			useUpdatedQueryControls,
		} = this.props;

		const {
			displayPostContent,
			displayPostDate,
			excerptLength,
			order,
			orderBy,
			postFeedType,
			postsToShow,
			columns,
			categories,
		} = attributes;

		const columnsCountOnChange = ( selectedColumns ) => {
			setAttributes( { columns:
				( selectedColumns > postsToShow ) ? postsToShow : selectedColumns,
			} );
		};

		const postsCountOnChange = ( selectedPosts ) => {
			const changedAttributes = { postsToShow: selectedPosts };
			if ( columns > selectedPosts || ( selectedPosts === 1 && columns !== 1 ) ) {
				Object.assign( changedAttributes, { columns: selectedPosts } );
			}
			setAttributes( changedAttributes );
		};

		const settings = (
			<PanelBody title={ __( 'Post Carousel settings', 'coblocks' ) }>
				<Fragment>
					<ToggleControl
						label={ __( 'Post date', 'coblocks' ) }
						checked={ displayPostDate }
						help={
							displayPostDate
								? __( 'Showing the publish date.', 'coblocks' )
								: __( 'Toggle to show the publish date.', 'coblocks' )
						}
						onChange={ () => setAttributes( { displayPostDate: ! displayPostDate } ) }
					/>
					<ToggleControl
						label={ __( 'Post content', 'coblocks' ) }
						checked={ displayPostContent }
						help={
							displayPostContent
								? __( 'Showing the post content.', 'coblocks' )
								: __( 'Toggle to show the post content.', 'coblocks' )
						}
						onChange={ () => setAttributes( { displayPostContent: ! displayPostContent } ) }
					/>
					{ displayPostContent &&
						<RangeControl
							label={ __( 'Max words in content', 'coblocks' ) }
							value={ excerptLength }
							onChange={ ( value ) => setAttributes( { excerptLength: value } ) }
							min={ 5 }
							max={ 75 }
						/>
					}
					<RangeControl
						label={ __( 'Columns', 'coblocks' ) }
						value={ columns }
						onChange={ ( value ) => columnsCountOnChange( value ) }
						min={ 1 }
						max={ Math.min( 4, postCount ) }
						required
					/>
				</Fragment>
			</PanelBody>
		);

		const deprecatedQueryControls = (
			<QueryControls
				{ ...{ order, orderBy } }
				categoriesList={ categoriesList }
				selectedCategoryId={ attributes.categories }
				onOrderChange={ ( value ) => setAttributes( { order: value } ) }
				onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
				onCategoryChange={ ( value ) => setAttributes( { categories: '' !== value ? value : undefined } ) }
			/>
		);

		const updatedQueryControls = () => {
			const categorySuggestions = categoriesList.reduce(
				( accumulator, category ) => ( {
					...accumulator,
					[ category.name ]: category,
				} ),
				{}
			);

			const suggestions = categoriesList.reduce(
				( accumulator, category ) => ( {
					...accumulator,
					[ category.name ]: category,
				} ),
				{}
			);

			return ( <QueryControls
				{ ...{ order, orderBy } }
				categorySuggestions={ categorySuggestions }
				selectedCategories={ attributes.categories }
				onOrderChange={ ( value ) => setAttributes( { order: value } ) }
				onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
				onCategoryChange={ ( tokens ) => {
					// Categories that are already will be objects, while new additions will be strings (the name).
					// allCategories nomalizes the array so that they are all objects.
					const allCategories = tokens.map( ( token ) =>
						typeof token === 'string' ? suggestions[ token ] : token
					);
					setAttributes( { categories: allCategories } );
				} }
			/> );
		};

		return (
			<InspectorControls>
				{ hasPosts ? settings : null }
				<PanelBody title={ __( 'Feed settings', 'coblocks' ) } initialOpen={ ! hasPosts ? true : false }>
					<RadioControl
						selected={ postFeedType }
						options={ [
							{ label: __( 'My blog', 'coblocks' ), value: 'internal' },
							{ label: __( 'External feed', 'coblocks' ), value: 'external' },
						] }
						onChange={ ( value ) => setAttributes( { postFeedType: value } ) }
					/>
					{ hasPosts || ( !! categories && categories?.length > 0 )
						? <Fragment>
							{ postFeedType === 'internal' &&
								useUpdatedQueryControls ? updatedQueryControls() : deprecatedQueryControls
							}
							<RangeControl
								label={ __( 'Number of posts', 'coblocks' ) }
								value={ postsToShow }
								onChange={ ( value ) => postsCountOnChange( value ) }
								min={ 1 }
								max={ 20 }
							/>
						</Fragment> : null }
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;
