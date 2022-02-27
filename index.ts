export interface Directive {
  alias: string
  name: string
  flags?: string[]
  input?: boolean
  children?: Directive[]
}

const inputRe = '([^\\s]+)'

export default function Parser<Result = any>(
  directives: Directive[],
  context: string = process.argv.slice(2).join(' ')
): Result {
  const tree: any = {}
  directives.forEach((directive) => {
    const { alias, name, input, flags } = directive
    const matcher1 = new RegExp(`${name} ${input ? inputRe : ''}`)
    const matcher2 = new RegExp(`${alias} ${input ? inputRe : ''}`)
    const res = matcher(matcher1, context) || matcher(matcher2, context)
    let flagsRes: any = flags ? matchFlags(flags, context) : null
    res && (tree[directive.name] = { value: res, flags: flagsRes })

    if (directive.children) {
      directive.children.forEach((child) => {
        const {
          alias: aliasNest,
          name: nameNest,
          input: inputNest,
          flags: flagsNest,
        } = child
        const matcher1 = new RegExp(`${name} ${nameNest} ${inputNest ? inputRe : ''}`)
        const matcher2 = new RegExp(`${alias} ${aliasNest} ${inputNest ? inputRe : ''}`)
        const res = matcher(matcher1, context) || matcher(matcher2, context)
        let flags: any = flagsNest ? matchFlags(flagsNest, context) : null
        res && (tree[directive.name] = {})
        res &&
          (tree[directive.name][child.name] = { value: res, ...(flags && { flags }) })
      })
    }
  })
  return tree
}

function matcher(regex: RegExp, context: string) {
  const result = regex.exec(context)
  return result && (result[1] || true)
}
function matchFlags(flags: string[], context: string) {
  const res: any = {}
  flags.forEach((flag) => {
    const flagName = flag.replace('$', '')
    if (flag.includes('$')) {
      // flag with value
      const flagRe = new RegExp(`-?-${flagName}[=\\s]${inputRe}`)
      const result = flagRe.exec(context)
      result && (res[flagName] = result[1] || true)
    } else {
      // flag without value
      const flagRe = new RegExp(`-?-${flagName}`)
      const result = flagRe.exec(context)
      res[flag] = result ? true : false
    }
  })
  return res
}
