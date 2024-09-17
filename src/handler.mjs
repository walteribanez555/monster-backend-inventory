
import { ping } from "./utils/ping.mjs";
import { buildResponse, parseJsonToObject } from './utils/helpers.mjs';
import { deleteInputs, getInputs, postInputs, putInputs } from "./controllers/inputs.controller.mjs";
import { deleteOutputs, getOutputs, postOutputs, putOutputs } from "./controllers/outputs.controller.mjs";
import { deleteProducts, getProducts, postProducts, putProducts } from "./controllers/products.controller.mjs";
import { deleteProviders, getProviders, postProviders, putProviders } from "./controllers/providers.controller.mjs";
import { deleteWarehouses, getWarehouses, postWarehouses, putWarehouses } from "./controllers/warehouses.controller.mjs";
import { deleteProductTypes, getProductTypes, postProductTypes, putProducTypes } from "./controllers/products_type.controller.mjs";


export const handler = async (event) => {
    console.log( 'Main Fecha-Hora: ', new Date() );
    console.log( 'EVENT: ' , event );
    const { method, path } = event?.requestContext?.http ? event.requestContext.http : {};
    // const authorization = event?.headers?.authorization ? event.headers.authorization : false;
    // const schema = event.headers.schema || 'assist_trip';
    const { id, init, end, product_id,warehouse_id  } = typeof( event.queryStringParameters ) === 'object' && Object.keys( event.queryStringParameters ).length > 0 ? event.queryStringParameters : false;
    const data = typeof( event.body ) === 'string' && Object.keys( parseJsonToObject( event.body ) ).length > 0 ? parseJsonToObject( event.body ) : {};
    console.log( 'DATA: ' , data );
    console.log( 'ID: ' , id );
    console.log( 'METHOD: ' , method.toLowerCase() );
    console.log( 'PATH: ' , path );
    // Your Lambda function code

    const endpoints = {
        '/' : ping,
        '/inputs' : { 
            'get' : getInputs,
            'post': postInputs,
            'put' : putInputs,
            'delete' : deleteInputs,

        },
        '/outputs' : {
            'get' : getOutputs,
            'post' : postOutputs,
            'put' : putOutputs,
            'delete' : deleteOutputs

        },
        '/products' : { 
            'get' : getProducts,
            'post' : postProducts,
            'put' : putProducts,
            'delete' : deleteProducts,
        },
        '/product-types':{
            'get' : getProductTypes,
            'post' :postProductTypes,
            'put' :putProducTypes,
            'delete' :deleteProductTypes,
        },
        '/providers' : { 
            'get' : getProviders,
            'post': postProviders,
            'put' : putProviders,
            'delete' : deleteProviders,
        },
        '/warehouses' : {
            'get': getWarehouses,
            'post':postWarehouses,
            'put': putWarehouses,
            'delete' : deleteWarehouses,
        },
        
        'others' : buildResponse,
    }

    if(path === '/'){
        return endpoints[path]()
    }


    try {

        if ( endpoints.hasOwnProperty( path ) )
            return await endpoints[ path ][ method.toLowerCase() ]( { id, init, end, product_id, quantity, data} );

        return endpoints.others( 404, { message : '404 Not Found' }, 'other' );

    } catch ( error ) {
        console.log( 'ERROR VERIFIED: ', error );
        return endpoints.others( 400, { message : error }, 'other' );
    }
    


};