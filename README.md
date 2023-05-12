# Acceleration.js
Acceleration.js specifies and implements a protocol for easily building single-page applications. It is heavily inspired by inertia.js

## Abstract
Writing mordern single-page webapps most of the time requires writing a front and a backend. In that case the backend provides some kind of API (e.g.: REST, GraphQL) that is used by the frontend to display data. Although this approach is verry flexable and decouples the backend from the frontend (compared to multipage-apps where the fronend is thightly coupled to the backend), it often makes the frontend quite messy, since it has to fatch all its data via AJAX calls.
Acceleration.js tryies to solve this problem by allowing the user to program the frontend in an old-school multipage-manner whilst still decoupeling the frontend from the backend. This allows building clean and simple frontends without the hassle of asyncroniously fatching the data from the backend.

## Philosophy
Instead of just programming a library for every backend/frontend framework this library focuses on not using any frameworks and not unsing any dependencies. This allows the user to use this library completely independant from the framework he uses.

## The Backend
The backend library for acceleration is implemented in PHP. Acceleration offers a single function "Acceleration::render". This function accepts a name for the frontend page that should be displayed and an array with all the data that is required by this page.
The Function that starts by checking if the "X-Acceleration" Header is set to true. If it is, the function simply returns an JSON page object. The Object has the following format:
{
    page: String,
    props: {
        ...
    },
    url: String
}
Opening the required Page is done by the frontend library.

If the Header isn't true, the function returns a full html page. The page contains a main div. The divs attribute "x-page" holds an instance of a JSON page object.

## The Frontend
The Frontend consists out of a simple library that provides:
* routing capabilities
* form capabilities
* a way of calling backend routes
### The route function
This function can be called whenever the "page" object changes. It then swaps the currently displayed content in the main div with the webcomponent referenced in the "page" object. That way it acts as kind of a router. The function passes the props array as an property down to the webcomponent. Inside the Webcomponents the property object can then be accessed vai the ```this.props``` field. This function also updates the browser history, to include the new webpage.
### The initAcceleration function
This function is automatically called when the webpage is first loaded. It checks if there is a "main" div, check if that "main" div has the "x-page" attribute and then calls "route" with the value of the "x-page" attribute.
### The visit function
This function can be used to call the backend and visit new webpages. It simply fires an http request with the X-ACCELERATION Header set and calls the route function with the resulting "page" object
### The get/post/put/patch/delete_ functions
These functions act as a wrapper around the visit function. 