## Test-first, no "agregar tests después"

Antes de HTML6, mi hábito de testing era el común: construir la funcionalidad, y después agregar un puñado de tests. Confirmar que los casos obvios funcionan, seguir adelante.

Mi jefe en Eldøy me exigió algo más estricto, una práctica llamada Desarrollo Guiado por Pruebas (TDD, por sus siglas en inglés): escribir un test unitario enfocado para una función *antes* de escribirla. Asegurarme de que cubriera de verdad el rango de inputs que esa función podía recibir, no solo el camino feliz.

<figure>
<svg viewBox="0 0 690 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama del ciclo de TDD: escribir un test que falla, hacerlo pasar, refactorizar, y repetir">
  <defs>
    <marker id="html6tdd-cycle-arrow-es" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
    </marker>
  </defs>
  <text x="340" y="20" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor" fill-opacity="0.75">repetir, un caso de test a la vez</text>
  <path d="M 570 130 C 570 35, 110 35, 110 130" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#html6tdd-cycle-arrow-es)" />
  <line x1="205" y1="175" x2="240" y2="175" stroke="currentColor" stroke-width="1.5" marker-end="url(#html6tdd-cycle-arrow-es)" />
  <line x1="435" y1="175" x2="470" y2="175" stroke="currentColor" stroke-width="1.5" marker-end="url(#html6tdd-cycle-arrow-es)" />
  <rect x="15" y="130" width="190" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="110" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Test que falla</text>
  <text x="110" y="196" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">red</text>
  <rect x="245" y="130" width="190" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="340" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Hacerlo pasar</text>
  <text x="340" y="196" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">green</text>
  <rect x="475" y="130" width="190" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="570" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Refactorizar</text>
  <text x="570" y="196" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">sigue en verde</text>
</svg>
<figcaption>El ciclo detrás de cada función en HTML6: primero un test que falla, después el cambio mínimo que lo hace pasar, y una limpieza antes de pasar al siguiente caso.</figcaption>
</figure>

Al principio se sentía más lento: escribir el test antes de la función significa decidir qué tiene que hacer antes de meterte en cómo lo va a hacer. Dejó de sentirse como carga extra en cuanto ese hábito hizo que cada función nueva arrancara desde una especificación clara y acotada, en vez de una página en blanco.

## Construyendo función por función

[HTML6](https://github.com/eldoy/html6) compila una plantilla a través de un pipeline de piezas chicas y separadas:

- **Parser** — convierte HTML crudo en un árbol
- **Transpiler** — convierte ese árbol en una función de renderizado
- **Masking** — esconde los tags especiales (`if`, `elsif`, `else`, `map`) detrás de placeholders durante la compilación
- **Chain-walker** — resuelve las secuencias de `if`/`elsif`/`else` entre elementos hermanos
- **Topological sort** — ordena la compilación de componentes según sus dependencias

Cada una vive en su propio archivo. Cada una tuvo su propia suite de tests antes de conectarse con la siguiente pieza.

Código con una suite de tests real alrededor es código que podés cambiar con confianza. Código que solo estás probando indirectamente, a través de todo el pipeline, es código al que le tenés miedo.

## Un bug que nunca llegó a producción

Acá es donde test-first se gana el nombre de verdad. El test no se escribe después de encontrar un bug. Escribirlo es cómo se encuentra el bug.

Tomá una plantilla simple: recorré una lista y renderizá cada item.

```html
<li map="p of ps">{{p}}</li>
```

Cubrir el rango de inputs, como pide el hábito, significa testear qué pasa cuando la lista misma es `null`, no solo cuando está vacía. Escribir ese test fue lo que sacó a la luz el problema: el código compilado llamaba a `.map()` directamente sobre lo que llegara, y `.map()` sobre `null` explota.

Rojo primero:

```js
return mapArg.map(function(project) { ... })
```

Después el fix, una línea:

```js
return (mapArg || []).map(function(project) { ... })
```

Verde. Y el test que encontró el bug es el mismo que ahora lo cuida de que vuelva:

```js
test('map - empty', async ({ t }) => {
  var page = '<ul><li map="p of ps">{{p}}</li></ul>'
  var renderer = html.compile(page)
  var data = { ps: null }
  var result = renderer.render(data)
  t.equal(result, '<ul></ul>')
})
```

Ese es el hábito real que construye test-first: no "nunca romper nada", sino "encontrar vos mismo el quiebre, antes que cualquier otro, testeando el caso que de otra forma te habrías salteado".

## Lo que cambió

Esta disciplina es gran parte de por qué después pude encarar reescribir todo el compilador de HTML6 para que fuera más rápido con confianza real, en lugar de que fuera un salto de fe. Reescribir un código que está genuinamente cubierto, función por función, es un tipo de riesgo distinto a reescribir uno sostenido por chequeos manuales y esperanza.
