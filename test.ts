import Parser, { Directive } from '.'

const Directives: Directive[] = [
  {
    alias: 'g',
    name: 'generate',
    children: [
      {
        alias: 'c',
        name: 'component',
        input: true,
        flags: ['flat', 'inline'],
      },
    ],
  },
  {
    alias: 'n',
    name: 'new',
    input: true,
    flags: ['style$'],
  },
]

const data = Parser(Directives)

console.log(data)
