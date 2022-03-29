# coc-bibtex

This [Coc](https://github.com/neoclide/coc.nvim) extension adds a BibTeX source to CocList. You can access it by running `:CocList bibtex` in (Neo)Vim. You can also use it as an autocompletion source for BibTeX entries.

## Installation

Run `:CocInstall coc-bibtex` to install.

## Configuration

Changing your `coc-settings.json` file will change the behavior of `coc-bibtex` concerning:

* Setting BibTeX File Location
* Changing Supported Filetypes
* Using with LaTeX
* Silencing Cache Messages

### Setting BibTeX File Location

Set `coc.preferences.bibtex.files` to an array containing your `.bib` files. For instance, in `coc-settings.json`:

~~~json
{
// …
  "list": {
    "source": {
      "bibtex": {
        "files": [
          "~/my-library.bib"
        ]
      }
    }
  }
// …
}
~~~

Or in vimrc:

~~~vim
call coc#config('coc.preferences.bibtex', {
  \  'files': [
  \    '~/my-library.bib'
  \  ]
  \})
~~~

### Changing Supported Filetypes

By default, the following filetypes are supported for completion:

* tex
* plaintex
* latex
* pandoc
* markdown

To change this behavior, determine the `filetype` (in Vim) you wish to add. This can be done by running `:set filetype?` with the kind of file you wish to support. Then, edit `coc.preferences.bibtex.filetypes` to include the `filetype` you wish to support (you will also have to include the default types, too).

If, for instance, you wanted to add support for `.textile` files, you would need to include the following in your `coc-settings.json` file:

~~~json
coc.preferences.bibtex.filetypes: [
	"tex",
	"plaintex",
	"latex",
	"pandoc",
	"markdown",
	"textile"
]
~~~

And textile support will be added.

### Using with LaTeX

LaTeX is support for both completion and list management

#### Completion

To trigger completion with a citation command in LaTeX, instead of the pandoc-style `@`, add the following to `coc-settings.json`:

~~~json
{
//...
  "coc.preferences.bibtex.triggerPatterns": ["\\\\cite\\{"],
  "coc.preferences.bibtex.triggerCharacters": []
}
~~~

This will also work for the `\cite{}` command. Changing `coc.preferences.bibtex.triggerPatterns` to `cite\\{` will work for any of the commands that end in `cite`, not just `\cite`.

#### List

The default configuration for the list source is to insert pandoc-style citations (`[@cite-key]`). If you would like to use this extension with LaTeX, add the following configuration:

In `coc-settings.json`:

~~~json
{
//...

"coc.preferences.bibtex": {
    "citation": {
      "before": "\\cite{",
      "after": "}"
    }
  }
}
//...
}
~~~

### Silencing Caching Messages

To turn off the message that `coc-bibtex` is caching your `.bib` files, set `bibtex.silent` to `true` in your `coc-settings.json` file.

## Useful Commands

`coc-bibtex` provides the following commands (which can be called as `:CocCommand <command name>` in Vim):

* `bibtex.reloadLibrary` – This will reload the library, updating the cache with any new changes.

## Todo

* [ ] Add the ability to pass a `.bib` file as an argument to the list call
* [ ] Color
