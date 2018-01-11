define([
    'create-react-class',
    'react-redux',
    'configuration/plugins/registry',
    './ProductDetail',
    './ProductDetailEmpty',
    './ProductDetailNoSelection',
    'data/web-worker/store/product/actions',
    'data/web-worker/store/product/selectors'
], function(
    createReactClass,
    redux,
    registry,
    ProductDetail,
    ProductDetailEmpty,
    ProductDetailNoSelection,
    productActions,
    productSelectors) {
    'use strict';

    const ProductDetailContainer = createReactClass({
        render() {
            const props = this.props;
            var { product, products, extensions } = props;

            if (product) {
                return (<ProductDetail {...props} />);
            } else if (products && products.length) {
                return (<ProductDetailNoSelection {...props} />);
            } else if (extensions) {
                return (<ProductDetailEmpty {...props} />);
            }

            return null
        }
    })

    return redux.connect(

        (state, props) => {
            const product = productSelectors.getProduct(state);
            const { loading, loaded } = productSelectors.getStatus(state);
            const extensions = registry.extensionsForPoint('org.visallo.workproduct');
            const workspace = state.workspace.currentId ?
                state.workspace.byId[state.workspace.currentId] : null;

            if (product) {
                const productExtensions = _.where(extensions, { identifier: product.kind });

                if (productExtensions.length === 0) {
                    throw Error('No org.visallo.workproduct extensions registered for: ' + product.kind)
                }
                if (productExtensions.length !== 1) {
                    throw Error('Multiple org.visallo.workproduct extensions registered for: ' + product.kind)
                }
                return {
                    padding: state.panel.padding,
                    product,
                    hasPreview: Boolean(productSelectors.getPreviewHash(state)),
                    extension: productExtensions[0],
                    workspace
                }
            } else if (extensions.length && loaded) {
                const user = state.user.current;
                return {
                    padding: state.panel.padding,
                    products: productSelectors.getProducts(state),
                    extensions,
                    editable: workspace && user ?
                        workspace.editable && user.privileges.includes('EDIT') :
                        false,
                    workspace
                };
            }
            return {}
        },

        (dispatch) => {
            return {
                onGetProduct: (id) => dispatch(productActions.get(id)),
                onCreateProduct: (kind) => dispatch(productActions.create(i18n('product.item.title.default'), kind))
            }
        }

    )(ProductDetailContainer);
});
