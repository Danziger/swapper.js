Swapper.js
==========

A JS class to help you toggle the visibility of parts (_pages_) of your web project.

License
-------
Licensed under the [MIT license](http://opensource.org/licenses/MIT).

Versioning
----------

Swapper.js will be maintained under the [Semantic Versioning](http://semver.org) guidelines, so releases will be numbered with the following format when possible:

`MAJOR.MINOR.PATCH`

And constructed with the following guidelines:

1. Breaking backward compatibility bumps the `MAJOR` (and resets the minor and patch).
2. Adding functionality without breaking backward compatibility bumps the `MINOR` (and resets the patch).
3. Bug fixes and misc changes bumps the `PATCH`.

Classes
-------

In order to make Swapper.js work as it is supposed to do so, you need to define the following classes with the specified behavior.

 - `.pageMe`: Nothing to do. This class will be used just to automatically find the elements you want to use as _pages_ in the DOM. The automatic selection will be explained next.
 - `.currentPage`: This class will be used to mark the current _page_, so it must apply the proper CSS properties to make it show up. It can also use transitions to make the _pages_ appear and disappear nicely.
 - `.deadPage`: This class is used to apply the same effects that `.currentPage` but just when a page dissapear. It will be used to fade away _pages_ that will be removed from the DOM once faded. Note that with the current implementation, the element will be removed when the `opacity` property's transition ends.

Methods
-------

###Swapper (constructor)
`SwapperInstance = new Swapper(IDs, currentIndex, defaultIndex, anchorMode)`

Creates a new instance of the Swapper class to manage all the _pages_ that match the `IDs` selector/s. You can also specify the current one providing the `currentIndex` argument and the default one with the `defaultIndex` argument. The last argument indicates that you want to use the URL hash instead of classes to select the current _page_ when `True`.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String / Array | `IDs` | Array of Strings of the IDs of the elements (_pages_) that should be shown and hidden. It can be a single String if there is only one ID. In that last case, there is a special value `"autoMODE"` (case sensitive) that will search for all elements in the current page with class `.pageMe`. If you want to create the object without any _pages_ just provide and **empty Array**. This argument can not be null.
| Integer | `currentIndex` | Index of the current element inside IDs range. It can be null if there's no page currently selected
| Integer | `defaultIndex` | Index of the current element inside IDs range. It can be null if you don't need the default-page feature. The **default-page feature** will make you toggle between the current _page_ and the default _page_ everytime you try to select the current (already selected) page.
| Boolean | `anchorMode` | `True` if you want to use the URL hash instead of classes to select the current _page_. `False` elsewhere.

###addPage
`SwapperInstance.addPage(ID)`

Add a new _page_ to the current set that matches the `ID` selector.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of one _page_ to add to the current set.


###addPages
`SwapperInstance.addPages(IDs)`

Add to the current set all the _pages_ that match the `IDs` selectors.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| Array | `IDs` | Array of Strings of the IDs of the _pages_ to add to the current set. In this case, it can not be a single String and there is no special value to search the elements automatically.

###setDefaultByID
`SwapperInstance.setDefaultByID(ID)`

Set the default page to the one, already in the current set, with the `ID` provided as an argument.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of the element already added to the current set that we want to use as default.

###setDefaultByIndex
`SwapperInstance.setDefaultByIndex(index)`

Set the default page to the one in the `index`-nth position of the current set.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| Integer | `index` | Index of the element already added to the current set that we want to use as default.

###clearDefault
`SwapperInstance.clearDefault()`

No arguments. It clears (set to null) the `defaultIndex` so that we disable the default-index feature.

###selectByID
`SwapperInstance.selectByID(ID)`

Set the current page to the one, already in the current set, with the `ID` provided as an argument and shows it (if the classes are defined properly).

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of the element already added to the current set that we want to show.

###selectByIndex
`SwapperInstance.selectByIndex(index)`

Set the current page to the one in the `index`-nth position of the current set and shows it (if the classes are defined properly).

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| Integer | `index` | Index of the element already added to the current set that we want to show.

###selectNone
`SwapperInstance.selectNone()`

No arguments. It clears (set to null) the `currentIndex` so that we don't have any active element on the set. It will also hide the current element from the page (if the classes are defined properly).

###kill
`SwapperInstance.kill(id)`

It will make the element that matches the `id` selector disappear (if the classes are defined properly), and will remove it from the DOM once the animation ends.

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `id` | ID of **any** element on the DOM that we want to apply the `.deadPage` class, usually to fade it, and that will be removed after the animation ends. Note that if this element is also in the current set, it won't be removed from it.


Attributes
----------

All attributes are public.

TO-DO
-----
 - [ ] Add a callback to call on transition end (with option to use delegation).
 - [ ] Add a parameter to use or not requestAnimationFrame.
 - [ ] Use parameters instead of strings for the classes used by swapper.js and add functions to change them programmatically (?).
 - [ ] Add a method to remove elements from the set.
