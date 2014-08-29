Swapper.js
==========

A JS class to help you toggle the visibility of parts of your web project.

License
-------
Licensed under the [MIT license](http://opensource.org/licenses/MIT).

Versioning
----------

Swapper.js will be maintained under the [Semantic Versioning] guidelines, so releases will be numbered with the following format when possible:

`MAJOR.MINOR.PATCH`

And constructed with the following guidelines:

1. Breaking backward compatibility bumps the `MAJOR` (and resets the minor and patch).
2. Adding functionality without breaking backward compatibility bumps the `MINOR` (and resets the patch).
3. Bug fixes and misc changes bumps the `PATCH`.

Methods
-------

###Swapper (constructor)
`SwapperInstance = new Swapper(IDs, currentIndex, defaultIndex, anchorMode)`

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String / Array | `IDs` | Array of Strings of the IDs of the elements (container/_page_) that should be shown and hidden. It can be a single String if there is only one ID. In that last case, there is a special value `"autoMODE"` (case sensitive) that will search for all elements in the current page with class `.pageMe`.
| Integer | `currentIndex` | Index of the current element inside IDs range. It can be null.
| Integer | `defaultIndex` | Index of the current element inside IDs range. It can be null.
| Boolean | `anchorMode` | `True` if you want to use the hash instead of classes to show and hide the elements. `False` elsewhere.

###addPage
`SwapperInstance.addPage(ID)`

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of one element (container/_page_) to add to the current set.


###addPages
`SwapperInstance.addPages(IDs)`

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| Array | `IDs` | Array of Strings of the IDs of the elements (container/_page_)to add to the current set. In this case, it can not be a single String and there is no special value to search the elements automatically.

###setDefaultByID
`SwapperInstance.setDefaultByID(ID)`

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of the element already added to the current set that we want to use as default.

###setDefaultByIndex
`SwapperInstance.setDefaultByIndex(defaultIndex)`

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| Integer | `defaultIndex` | Index of the element already added to the current set that we want to use as default.

###clearDefault
`SwapperInstance.clearDefault()`

No arguments. It clears (set to null) the default index so that we disable this feature.

###selectByID
`SwapperInstance.selectByID(ID)`

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| String | `ID` | ID of the element already added to the current set that we want to show.

###selectByIndex
`SwapperInstance.selectByIndex(index)`

|         Type         |         Argument         | Description |
|----------------------|--------------------------|-------------|
| Integer | `index` | Index of the element already added to the current set that we want to show.

###selectNone
`SwapperInstance.selectNone()`

No arguments. It clears (set to null) the current index so that we don't have any active element on the set.


###kill
`SwapperInstance.kill(id)`

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
