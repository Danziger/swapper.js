swapper.js
==========

A JS class to help you toggle the visibility of parts (_pages_) of your web project.





Author and License
-------------------

By Dani Gámez Franco, http://gmzcodes.com

Licensed under the [MIT license](http://opensource.org/licenses/MIT).





Versioning
----------

**CURRENT VERSION:** `2.0.0`

Swapper.js will be maintained under the [Semantic Versioning](http://semver.org) guidelines, so releases will be numbered with the following format when possible:

`MAJOR.MINOR.PATCH`

And constructed with the following guidelines:

1. Breaking backward compatibility bumps the `MAJOR` (and resets the minor and patch).
2. Adding functionality without breaking backward compatibility bumps the `MINOR` (and resets the patch).
3. Bug fixes and misc. changes bumps the `PATCH`.





Classes
-------

In order to make swapper.js work as it is supposed to, you need to define the following classes with the specified behavior. The `classNames` attribute can be changed to use custom class names, but it will be updated **in the prototype**, so all the instances of `Swapper` will be affected. You can change it using the `options` argument of the constructor. We will see that in detail later.

 - `.page`: Nothing to do. This class will be used just to automatically find the elements you want to use as _pages_ in the DOM. The automatic selection will be explained later.
 - `.pageButton`: Same as `.page` but for buttons.
 - `.currentPage`: This class will be used to mark the current _page_, so it must apply the proper CSS properties to make it show up. You can also use transitions to make the _pages_ appear and disappear nicely and to trigger a `transitioEnd` event, that will call a callback when the chosen property's transition finish. You can set a `0s` transition on any property if you want the callback to be called immediately. We will see that in detail later.
 - `.currentButton`: This class will be used to mark the current _page_'s button (when provided), so it must apply the proper CSS properties to differentiate it from the rest.
 - `.loadingPage`: This class is used to mark a _page_ as _loading_. You can use it to apply some CSS effects on it to show that (show a simple loader using pseudoelements or even a more elaborated one showing a bunch of HTML child elements over it).
 - `.deadPage`: This class is used to apply the same or similar effects that `.currentPage` but it will be used to fade away _pages_ that will be removed from the DOM once the chosen property's transition finish.

By default, the CSS property whose transition end indicates when to call the callbacks is `opacity`. We will see how to change that, the class names and how to disable the callbacks next.

Check the examples for a better idea on what these classes should do.





Examples
--------

None for the moment. They will be here soon.





Attributes
----------

###PUBLIC

 - `SwapperInstance.pagesIDs`: Array of ids (Strings) of the _pages_ elements in the DOM.
 - `SwapperInstance.pagesDOM`: Array of DOM elements that represent the _pages_.
 - `SwapperInstance.buttonsIDs`: Array of ids (Strings) of the buttons elements in the DOM.
 - `SwapperInstance.buttonsDOM`: Array of DOM elements that represent the buttons.
 - `SwapperInstance.callbacks`: Object of callbacks associated to each _page_ (one or none per page). The key must be equal to the _page_'s we want to put the callback on and its value must be a function.
 - `SwapperInstance.callbacksEnabled`: Boolean telling if the callbacks are enabled or not.
 - `SwapperInstance.pagesCount`: Integer telling the number of _pages_.
 - `SwapperInstance.masterProperty`: String of the CSS property whose transition end indicates when to call the callbacks if enabled. `opacity` by default.
 - `SwapperInstance.transitionEvent \ Swapper.prototype.transitionEvent`: **In prototype**. String of transition end event supported by the current browser.
 - `SwapperInstance.classNames \ Swapper.prototype.classNames`: **In prototype**. Object containing the class names to be used. Explained in detail in the following section.





Methods
-------

###CONSTRUCTOR
`SwapperInstance = new Swapper(IDs, currentIndex, defaultIndex, options)`

Creates a new instance of the `Swapper` class to manage all the _pages_ that match the `IDs` selector/s. You can also specify the current one providing the `currentIndex` argument and the default one with the `defaultIndex` argument. The last argument indicates some extra options that are not so commonly used.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String / Array | `IDs` | Array of Strings of the IDs of the elements (_pages_) that should be shown and hidden. It can be a single String if there is only one ID. In that last case, there is a special value `"autoMODE"` (case sensitive) that will search for all elements in the current page with the page class (`.page` by default). If you want to create the object without any _pages_ just provide an empty Array or a falsy value (`0`, `null`,  `undefined`, `false`, ...). If any of the specified ids does not exist, an error will be shown in console (but not thrown).
| Integer | `currentIndex` | Index of the current element inside IDs range. It can be null if there's no page currently selected
| Integer | `defaultIndex` | Index of the current element inside IDs range. It can be null if you don't need the default-page feature. The **default-page feature** will make you toggle between the current _page_ and the default _page_ everytime you try to select the current (already selected) _page_.
| Object | `options` | All the options avaible are explained next.

`options` argument:

|      Type      |      key      | Description |
|----------------|---------------|-------------|
| Boolean | `anchorMode` | `true` if you want to use the URL hash as well as classes to select the current _page_. `false` by default.
| Object | `classNames` | Object specifying the class names to be used (the ones explained in the previous section). The possible keys-values to be set have the same name both for key and value (default class name), so as said before, they are: `page`, `pageButton`, `currentPage`, `currentButton`, `loadingPage` and `deadPage`. Different key-value pairs will be discarded when merged with the default ones. Take into account that the class names **won't be validated** in any way, so an empty string or other values will be accepted and that will probably cause the module to throw an error later. 
| String / Array | `buttonsIDs` | Array of Strings of the IDs of the elements that should be used as buttons. It can be a single String if there is only one ID. In that last case, there is a special value `"autoMODE"` (case sensitive) that will search for all elements in the current _page_ with the page's button class (`.pageButton` by default). If you want to create the object without any buttons just provide an **empty Array** or a falsy value (`0`, `null`,  `undefined`, `false`, ...). If any of the specified ids does not exist, an error will be shown in console (but not thrown).
| Object | `callbacks` | Object specifying the callbacks associated to each _page_ `id`. The key must be equal to the `id` or an error will be thrown. The value must be a function and will receive the event object as an unique argument when called.
| Boolean | `callbacksEnabled` | `true` if you want to use the callbacks feature. `false` by default.
| String | `masterProperty` | CSS property whose transition end indicates when to call the callbacks, if enabled. `opacity` by default. The property specified is not validated for now.




###AUXILIAR (_PRIVATE_)

#####_normalizeIDs
`SwapperInstance._normalizeIDs(IDs, className)`

Returns the `IDs` parameter normalized as an Array of Strings (or an empty Array).

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| Array | `IDs` | Array of Strings that should be normalized. It can be a single String if there is only one ID. In that last case, there is a special value `"autoMODE"` (case sensitive) that will search for all elements in the current page with the `className` class and collect their ids. An empty Array or a falsy value (`0`, `null`,  `undefined`, `false`, ...) will return an empty array. Other values will throw an error.
| String | `className` | Class name to search elements whose ids to collect if `autoMODE` enabled.




###PUBLIC

####Page-Related Methods

#####addPage
`SwapperInstance.addPage(ID)`

Add a new _page_ to the current set that matches the `ID` selector.

It will show an error in console (but not thrown) if no element is found or if it was added previously 

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of one _page_ to add to the current set.


#####addPages
`SwapperInstance.addPages(IDs)`

Add to the current set all the _pages_ that match the `IDs` selectors. In this case, `IDs` can not be a single String and there is no special value to search the elements automatically.

It will show an error in console (but not throw) for each element not found or already added.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| Array | `IDs` | Array of Strings of the IDs of the _pages_ to add to the current set.


#####removeByID
`SwapperInstance.removeByID(ID)`

It will remove a _page_ from the current set and all its associated data (buttons and callbacks). Note that the _page_ element itself won't be removed from the DOM, but will be hidden and, if there's a default element, that one will be shown instead.

If no element matches the `ID` argument, an error will be shown in console (but not thrown).

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of one _page_ to remove from the current set.


#####removeByIndex
`SwapperInstance.removeByIndex(index)`

It will remove a _page_ from the current set and all its associated data (buttons and callbacks). Note that the _page_ element itself won't be removed from the DOM, but will be hidden and, if there's a default element, that one will be shown instead.

If the `index` argument is not of `number` type or it's out of bounds, an error will be shown in console (but not thrown).

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of one _page_ to remove from the current set.


#####selectByID
`SwapperInstance.selectByID(ID, loading)`

Set the current _page_ to the one, already in the current set, with the `ID` provided as an argument and shows it (if the classes are defined properly). It also sets the `loadingPage` class on it if `loading` argument is `true`.

If no element matches the `ID` argument, an error will be shown in console (but not thrown).

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of the _page_ we want to show.
| String | `loading` | `true` if we want to use a loader on that _page_.


#####selectByIndex
`SwapperInstance.selectByIndex(index, loading)`

Set the current _page_ to the one in the `index`-nth position of the current set and shows it (if the classes are defined properly). It also sets the `loadingPage` class on it if `loading` argument is `true`.

If the `index` argument is not of `number` type or it's out of bounds, an error will be shown in console (but not thrown).

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| Integer | `index` | Index of the _page_ we want to show.
| String | `loading` | `true` if we want to use a loader on that _page_.


#####selectNone
`SwapperInstance.selectNone()`

No arguments. It clears (set to null) the `currentIndex` so that we don't have any active element on the set. It will also hide the current element from the page (if the classes are defined properly).


#####kill
`SwapperInstance.kill(id)`

It will make the element (**any** element on the DOM) that matches the `id` selector disappear (if the `deadPage` class is defined properly), and will remove it from the DOM once the animation of the property specified by attribute `masterProperty` ends.

Note that if this element is also in the current set, it won't be removed from it.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `id` | `id` of the element we want to remove.



####Button-Related Methods

#####addButton
`SwapperInstance.addButton(ID)`

Add a new button to the current set that matches the `ID` selector.

Take into account that you can't add more buttons than _pages_. If you try to do that, an error will be shown in the console (but not thrown) and the action will be aborted.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | `id` of one button to add to the current set.


#####addButtons
`SwapperInstance.addButtons(IDs)`

Add to the current set all the buttons that match the `IDs` selectors. In this case, it can not be a single String and there is no special value to search the elements automatically.

Take into account that you can't add more buttons than _pages_. If you try to do that, an error will be shown in the console (but not thrown) and the action will be aborted.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| Array | `IDs` | Array of Strings of the `ids` of the buttons to add to the current set.



####Callback-Related Methods

#####setCallbackByID
`SwapperInstance.setCallbackByID(ID, callback)`

Sets the callback for the _page_, already in the current set, with the `ID` provided as an argument or removes it if `callback` is `null`.

If no element matches the `ID` argument or if the `callback` argument is not a function or `null` an error will be thrown.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of the _page_ we want to set the callback for.
| Function | `callback` | Callback function or null.


#####setCallbackByIndex
`SwapperInstance.setCallbackByIndex(index, callback)`

Sets the callback for the _page_ in the `index`-nth position of the current set or removes it if `callback` is `null`.

If the `index` argument is not of `number` type or it's out of bounds, an error will be shown in console (but not thrown).

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `index` | ID of the _page_ we want to set the callback for.
| Function | `callback` | Callback function or null.


#####removeCallbackByID
`SwapperInstance.removeCallbackByID(ID)`

Removes the callback for the _page_, already in the current set, with the `ID` provided as an argument.

If no element matches the `ID` argument an error will be thrown.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of the _page_ we want to remove the callback to.


#####removeCallbackByIndex
`SwapperInstance.removeCallbackByIndex(index)`

Removes the callback for the _page_ in the `index`-nth position of the current set.

If no element matches the `ID` argument an error will be thrown.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of the _page_ we want to remove the callback to.


#####enableCallbacks
`SwapperInstance.enableCallbacks()`

No arguments. It enable the callbacks binding the transition end event.

#####disableCallbacks
`SwapperInstance.disableCallbacks()`

No arguments. It disable the callbacks unbinding the transition end event. Note that it won't delete the callbacks.


####DefaultPage-Related Methods

#####setDefaultByID
`SwapperInstance.setDefaultByID(ID)`

Set the default _page_ to the one, already in the current set, with the `ID` provided as an argument.

If no element matches the `ID` argument an error will be thrown.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of the element we want to use as default.


#####setDefaultByIndex
`SwapperInstance.setDefaultByIndex(index)`

Set the default _page_ to the one in the `index`-nth position of the current set.

If `index` is not of `number` type, the default will be set to null.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| Integer | `index` | Index of the element we want to use as default or null to clear it.


#####clearDefault
`SwapperInstance.clearDefault()`

No arguments. It clears (set to null) the `defaultIndex` so that we disable the default-index feature.



####Loader-Related Methods

#####removeLoaderByID
`SwapperInstance.removeLoaderByID(ID)`

Removes the loader class from the _page_, already in the current set, with the `ID` provided as an argument.

If no element matches the `ID` argument an error will be shown in console (but not thrown).

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of the _page_ we want to remove the loader to.


#####removeLoaderByIndex
`SwapperInstance.removeLoaderByIndex(index)`

Removes the loader class from the _page_ in the `index`-nth position of the current set.

If the `index` argument is not of `number` type or it's out of bounds, an error will be shown in console (but not thrown).

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `index` | ID of the _page_ we want to remove the loader to.


#####removeAllLoaders
`SwapperInstance.removeAllLoaders()`

Removes the loader class from all the _pages_ in the current set.





TO-DO
-----
 - [ ] **Preload content**: Add methods (or create a derivated class) to add the functionality to preload content using AJAX or iframes **before** the user requests it.
 - [ ] **Paginate and cache content**: Add methods to _cache_ content that has already been requested by the user or preload (and _cache_) content that we think that will be requested later and manage it (set limits, decide which content to replace using LRU algorithm...).
 - [ ] **Navigation**: Implement the methods needed to enable history and back/forward-button functionality.
