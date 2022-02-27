# CMD ARGS PARSER

**Cmd args parser** es una librería para parsear los argumentos de un comando con una API sencilla, pero robusta con la capacidad de reconocer argumentos y `flags` que al igual que los argumentos, tambien seran extensibles.

## Motivación

Este proyecto surgio a partir de una necesidad de una librería que me permitiera procesar los argumentos que ingresaba a traves de la linea de comandos y mi constante motivacion por tratar de emular el comportamiento de algunas de las librerías mas famosas del area.

_cmd-args-parser_ nos permitira obtener los argumentos que ingresamos en la linea de comandos y procesarlos para que puedan ser utilizados de forma estructurada, ademas de ser facilmente extendible y muy similar al CLI de [Angular](https://angular.io/cli) ya que honestamente he construido esta aplicacion en base a esta libreria, pero algo mas minimalista y con una API mas sencilla.

## Instalacion

La instalacion es muy sencilla, solo debe instalar como cualquier otra dependencia de npm y luego debera importar la libreria en su proyecto, al no contar con dependencias de terceros, la instalación sera muy rapida.

```bash
# usando npm
npm install cmd-args-parser
# usando yarn
yarn add cmd-args-parser
```

## Uso

Para hacer familiar el uso de la libreria usare un ejemplo basado en el CLI de Angular.

> ### Vainilla JS

```javascript
import Parser from 'cmd-args-parser'

const directives = [
  {
    name: 'new',
    alias: 'n',
    input: true,
    flags: ['routing', 'styles$'],
  },
  {
    name: 'generate',
    alias: 'g',
    children: [
      {
        name: 'component',
        alias: 'c',
        input: true,
        flags: ['inline'],
      },
    ],
  },
]
const result = Parser(directives)
console.log(result)
```

> ### Uso con TypeScript

```TypeScript
import Parser, { Directive } from 'cmd-args-parser'


const directives: Directive[] = [
  {
    name: 'new',
    alias: 'n',
    input: true,
    flags: ['routing', 'styles$'],
  },
  {
    name: 'generate',
    alias: 'g',
    children: [
      {
        name: 'component',
        alias: 'c',
        input: true,
        flags: ['inline'],
      },
    ],
  },
]

interface Args {
  new?: {
    value: string
    flags: {
      routing: boolean
      styles: boolean
    }
  }
  generate?: {
    component?: {
      value: string
      flags: {
        inline: boolean
      }
    }
  }
}

const result = Parser<Args>(directives)
console.log(result.new.value)
```

> ### uso desde la terminal

```bash
$ node index.js new myApp --routing --styles scss
# salida esperada:
{ new:{ value: 'myApp', flags: { routing:true, styles: 'scss' } } }
```

### Uso fuera de la terminal

```ts
// Uso del context
const customContext = 'new myApp --routing --styles'

const result = Parser(directives, customContext)
```

## API

> ### Directive

| Argumento          | Description                       | Tipo                  |
| ------------------ | --------------------------------- | --------------------- |
| [`name`](#name)    | Nombre del argumento              | _string_              |
| [`alias`](#alias)  | Alias del argumento               | _string_              |
| [`input`](#input)  | Si el argumento espera un input   | _boolean_             |
| [`children`](#api) | Nuevo arreglo de _Directive[]_    | [_Directive[]_](#api) |
| [`flags`](#flags)  | Lista de atributos personalizados | _string[]_            |

#### `name`

Name es el nombre de la propiedad que se usara para obtener el valor del argumento y nombre de la propiedad que se usara para obtener el resto de los atributos.

| Recomendaciones                         | Ejemplo                |
| --------------------------------------- | ---------------------- |
| Minusculas y sin guiones de preferencia | `{ name: 'generate' }` |

#### `alias`

Alias es el identificador mas corto que se usara para obtener el valor del argumento de igual manera que el nombre, pero con una diferencia que el alias no debe ser una palabra completa, sino una palabra corta.
Eje: `g c my-component => g:generate, c:component, my-component:value`

| Recomendaciones                                                        | Ejemplo          |
| ---------------------------------------------------------------------- | ---------------- |
| Minusculas y sin guiones de preferencia, se recomienda de 1 a 3 letras | `{ alias: 'g' }` |

#### `input`

Propiedade que verifica si el argumeto espera una entrada de datos.

> Los espacios no estan soportados ya que se consideran una nueva instruccion.

| Recomendaciones                                        | Ejemplo           |
| ------------------------------------------------------ | ----------------- |
| Si no recibe valores puede omitir agregar la propiedad | `{ input: true }` |

#### `children`

Arreglo de _Directive[]_ que contiene las propiedades de los argumentos que se esperan.

| Recomendaciones                                        | Ejemplo               |
| ------------------------------------------------------ | --------------------- |
| Mismas recomendaciones con cada una de las propiedades | `{ children: [...] }` |

#### `flags`

Esta propiedad es un poco peculiar ya que si agregamos el simbolo `$` al final de una propiedad, esta sera considerada como un flag con valor, esto quiere decir que ademas de verificar que este exista, tambien podra recibir un valor.

En caso de no tener el sufijo `$` se considerara una propiedad que solo verificara si existe o no y solo recibira un valor booleano.

| Recomeendaciones                        | Ejemplo                    | Tipo          |
| --------------------------------------- | -------------------------- | ------------- |
| Minusculas y sin guiones de preferencia | `{ flags: [ 'inline' ] }`  | Regular       |
| Minusculas y sin guiones de preferencia | `{ flags: [ 'styles$' ] }` | Con propiedad |

> ### Parser

| Argumento                   | Description                                    | Tipo                  |
| --------------------------- | ---------------------------------------------- | --------------------- |
| [`directives`](#directives) | Nuevo arreglo de _Directive[]_                 | [_Directive[]_](#api) |
| `context`                   | Cadena de texto, por default es `process.argv` | _string_              |

## Limitaciones

- #### El nivel maximo de anidación de las directivas es de **2️⃣**.
  - Se espera que en versiones posteriores se implemente una mejora.
- No se permite el uso de espacios en ninguna de las propiedades.
- El simbolo `$` es de uso reservado para flags.
- El uso de los alias debe ser unicos, decir, no se puede combinar un alias con un `name`.
  - Ejemplo: `g component` ó `generate c`
  - La forma correcta es `g c` o `generate component`
