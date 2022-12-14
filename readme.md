<div id="top"></div>

# tukod

> Yarn workspaces/monorepo mini cli helper tools

<br />


## Installation


```bash
npm install -g tukod
```
**or**
```bash
yarn global add tukod
```


<br/>

## Usage

```bash
Usage
  $ tk <command> [options]

Commands
  generate  Generate a new app
  delete    Remove an app
  init      Create base files in the current directory

Options

  --help  Show help
  --version  Show version
  --no-confirm, Disable confirmation
  --dir, Change the current working directory 

generate
  --template, -t  Template to use
  --name, -n  Name of the app

delete
  --name, -n  Name of the app

init
  --name, -n Monorepo project name 

Examples
  $ tk generate --template=react-app --name=my-app
  $ tk init --name=monorepo-name
```

### **Making Templates**
----------
To add templates you must add templatesPaths in the tk field of your root package.json. templatesPaths field should contain all your templates directory (can be absolute or relative to monorepo directory).

Templates should have .tkignore so that it will be detected as a template. It should also have a package.json file.

```txt
// sample .tkignore

.turbo
dist
!node_modules/*
node_modules


```

### **Deleting Apps**
----------
To delete apps you need to create an empty `.unlock` file in the app directory


### **Configuration**
----------
```json
// package.json
{
    "tk": {
        "templates": [
          "path/to/additional/templates_list_1",
          "path/to/additional/templates_list_2",
          "P:/absolute/path/to/additional/templates_list_3"
        ]
    }
}
// or
{
  "workspaces": [
      "apps/*",
      "libs/*"
  ]
}
```


<br/>

## Roadmap

- [x] Generate App
  - [x] Template Paths
  - [ ] Remote Templates
- [x] Delete App
- [x] Initialize Base
  - [ ] Base Types
- [x] InkJS Renderer
  - [x] Operations
  - [ ] Replace Inquirer.JS
- [x] Add Publish Script

<br/>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<br/>