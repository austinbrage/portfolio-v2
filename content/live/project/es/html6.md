## Es simplemente .html

Cada plantilla de HTML6 es un archivo `.html` real. No `.pug`, no `.hbs`, no un archivo `.jsx` disfrazado de markup. Es HTML con algunos atributos extra y `{{ }}` de vez en cuando, así que tu editor, Prettier y cualquier linter que ya tengas lo entienden sin nada más.

Ese es el diferenciador real, más que cualquier feature puntual de las de abajo. No hay plugin que instalar, ni una extensión nueva que tu tooling tenga que aprender, ni un build step parado entre el archivo que escribís y el archivo que el navegador ya reconocería como HTML. Un diseñador UI/UX sin experiencia en JavaScript puede abrir el archivo y seguir exactamente qué está haciendo.

## JavaScript real, no un mini-lenguaje

Las interpolaciones y los condicionales ejecutan **expresiones de JavaScript reales** contra el scope de renderizado, no un lenguaje de plantillas simplificado que solo se le parece:

```html
<h1>{{title}}</h1>
<div if="user.loggedIn">Bienvenido de nuevo</div>
<div elsif="user.pending">Pendiente de aprobación</div>
<div else>Por favor iniciá sesión</div>
```

Si es JavaScript válido, es válido dentro de `{{ }}` o de un `if`. No hay un mini-lenguaje que tener que consultar.

## Loops con map

`map` recorre arrays directamente sobre el tag, con un índice opcional y su propio `if`:

```html
<ul>
  <li map="p, i of projects" if="p.title.length > 0">{{i}}: {{p.title}}</li>
</ul>
```

Los loops anidados funcionan igual, un atributo `map` por nivel:

```html
<div map="group of groups">
  <h2>{{group.name}}</h2>
  <ul>
    <li map="item of group.items">{{item}}</li>
  </ul>
</div>
```

## Pipes para transformaciones seguras

Las llamadas a funciones dentro de `{{ }}` están deshabilitadas por seguridad. `|>` encadena transformaciones sobre un valor en su lugar:

```html
{{title |> upper |> truncate 20}}
{{price |> formatCurrency}}
{{date |> formatDate 'YYYY-MM-DD'}}
```

Los pipes son simplemente funciones registradas por nombre, así que agregar uno nuevo son unas pocas líneas de JavaScript, no un cambio al lenguaje de plantillas en sí:

```js
var pipes = {
  upper: (x) => String(x).toUpperCase(),
  truncate: (x, len) => String(x).slice(0, len)
}

html6.compile(template, { pipes })
```

## Componentes, slots y props aislados

`<template is="...">` define un componente. `<slot>` marca dónde se insertan sus hijos. Los props quedan aislados a ese componente, mientras que todo lo demás del scope externo fluye hacia abajo automáticamente, sin tener que redeclararse en cada nivel:

```html
<template is="card" title="string">
  <div class="card">
    <h2>{{props.title}}</h2>
    <slot></slot>
  </div>
</template>
```

```html
<card title="Hola {{user.name}}">
  <p>Renderizado desde el slot.</p>
</card>
```

## Se compila una vez, corre en cada request

`compile()` toma la plantilla y devuelve una función de render. Esa es la parte costosa, así que solo corre una vez, al arrancar, y el resultado se guarda en caché. Cada request después de eso simplemente llama a esa función cacheada con datos frescos.

<figure>
<svg viewBox="0 0 690 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama que muestra una plantilla compilándose una vez en una función de render, y después ramificándose para servir múltiples requests sin recompilar">
  <text x="345" y="20" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor" fill-opacity="0.75">se compila una vez, se renderiza muchas</text>
  <defs>
    <marker id="html6flow-arrow-es" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
    </marker>
  </defs>
  <rect x="15" y="90" width="210" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="120" y="128" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">La plantilla compila</text>
  <text x="120" y="156" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">una vez, al arrancar</text>
  <line x1="225" y1="135" x2="285" y2="135" stroke="currentColor" stroke-width="1.5" />
  <path d="M305 100 L280 140 L298 140 L285 175 L325 130 L303 130 Z" fill="currentColor" />
  <line x1="330" y1="135" x2="555" y2="45" stroke="currentColor" stroke-width="1.5" marker-end="url(#html6flow-arrow-es)" />
  <line x1="330" y1="135" x2="555" y2="135" stroke="currentColor" stroke-width="1.5" marker-end="url(#html6flow-arrow-es)" />
  <line x1="330" y1="135" x2="555" y2="225" stroke="currentColor" stroke-width="1.5" marker-end="url(#html6flow-arrow-es)" />
  <rect x="560" y="20" width="46" height="50" rx="4" fill="none" stroke="currentColor" stroke-width="1.5" />
  <line x1="568" y1="35" x2="598" y2="35" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6" />
  <line x1="568" y1="48" x2="590" y2="48" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6" />
  <rect x="560" y="110" width="46" height="50" rx="4" fill="none" stroke="currentColor" stroke-width="1.5" />
  <line x1="568" y1="125" x2="598" y2="125" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6" />
  <line x1="568" y1="138" x2="590" y2="138" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6" />
  <rect x="560" y="200" width="46" height="50" rx="4" fill="none" stroke="currentColor" stroke-width="1.5" />
  <line x1="568" y1="215" x2="598" y2="215" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6" />
  <line x1="568" y1="228" x2="590" y2="228" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6" />
</svg>
<figcaption>Compilar depende solo de la plantilla, así que pasa una vez y se cachea. Renderizar depende solo de los datos, así que cada request simplemente vuelve a llamar a esa función cacheada. Un motor ya rápido, hecho todavía más rápido: la compilación nunca corre dos veces.</figcaption>
</figure>

## Dónde corre realmente

HTML6 se lanzó por primera vez en producción en [Nobo](https://en.nobo.no/), el lugar de trabajo donde todo esto empezó. También impulsa [Ultimate Learning](https://ultimatelearning.app/), una app de aprendizaje de idiomas que mantengo activamente. Dos sitios reales en producción, no una demo que se construyó una vez y se abandonó.
