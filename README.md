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

