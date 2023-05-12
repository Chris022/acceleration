//@ts-check

//---------------------------------- This section listens for events -------------------------------//

//once the website is loaded call the initAcceleration function in order to load the correct webcomponent
window.addEventListener("DOMContentLoaded", initAcceleration);

//everytime the user hits the back button in his browser, the correct webcomponent has to be loaded again
//this is done by calling the route function with the page object from the page in the history
window.addEventListener("popstate", (event) => route(event.state))

//---------------------------------------------- END ----------------------------------------------//


//-------------------------- This function provieds basic functionality. --------------------------//

/**
 * The function that is called when the page is loaded the first time
 */
function initAcceleration() {
    let main_div = document.getElementById("main");
    if (!main_div) throw "Acceleration Error: No div with id 'main' found!";

    if (!!!main_div.hasAttribute("x-page")) throw "Acceleration Error: The main div is missing the x-page attribute";

    let page_object = JSON.parse(/** @type {string} */(main_div.getAttribute("x-page")));

    route(page_object);
}

/**
 * The function that loads the correct webcomponent based on the response from the backend
 * 
 * @param {object} page_object
 */
function route(page_object) {
    //create a new html element and insert it into the main div
    //the name of the element is the component 
   let webcomponent_name = page_object["component"];

    if (!!!webcomponent_name) throw "Acceleration Error: The page_object does not include a 'component' attribute!";

    /**@type {AccelerationComponent} */
    let component = document.createElement(webcomponent_name);

    //set the props property in the webcomponent
    let props = page_object["props"];
    if(!!!props) throw "Acceleration Error: The page_object does not include a 'props' attribute!";

    component.setProps(props);

    //get the main div and set its content
    let main_div = document.getElementById("main");
    if (!main_div) throw "Acceleration Error: No div with id 'main' found!";
    //clear all children
    main_div.innerHTML = "";
    //set the new child
    main_div.appendChild(component);

    //if everything was successfull add the new page to the history
    history.pushState(page_object, "", page_object["url"])
}

//------------------------------------------ END ------------------------------------------//


//- This section provides a base class for creating the Webcomponents that represent the different pages. -


/**
 * The baseclass for all Webcomponents that might be routed by Acceleration
 * @class
 * @constructor
 * @public
 * @abstract
 * 
 * @extends HTMLElement
 */
class AccelerationComponent extends HTMLElement{

    /**
     * This property holds all the data the was passed from the backend to the frontend
     * @type {Object<string,any>}
     * @protected
     */
    props;

    constructor() {
        super();
    }

    /**
     * This function allows to set the props property
     * @param {Object<string,any>} props 
     */
    setProps(props){
        this.props = props;
    }

}
//------------------------------------------ END ------------------------------------------//


//------------This section features functions that can be used to visit new pages----------//

/**
 * This function can be used to call the backend with a post call - this also updates the browser history
 * @param {string} url 
 * @param {object} body
 * @param {string} method
 */
function visit(url, body, method) {
    let ret = fetch(
        url,
        {
            "method": method,
            "headers": {
                "X-ACCELERATION": "1"
            },
            "body": body
        }
    )
    ret.then(result => result.json())
        .then(page => route(page))
}

/**
 * Helper for a specific http method
 * @param {string} url 
 * @param {object} body
 */
function get(url, body){
    visit(url,body,"GET");
}
/**
 * Helper for a specific http method
 * @param {string} url 
 * @param {object} body
 */
function post(url, body){
    visit(url,body,"POST");
}
/**
 * Helper for a specific http method
 * @param {string} url 
 * @param {object} body
 */
function patch(url, body){
    visit(url,body,"PATCH");
}
/**
 * Helper for a specific http method
 * @param {string} url 
 * @param {object} body
 */
function put(url, body){
    visit(url,body,"PUT");
}
/**
 * Helper for a specific http method
 * @param {string} url 
 * @param {object} body
 */
function delete_(url, body){
    visit(url,body,"Delete");
}
//------------------------------------------ END ------------------------------------------//

//TODO implement loading animation
