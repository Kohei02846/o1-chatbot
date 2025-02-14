declare module 'react-markdown' {
  import { ReactNode, ComponentType, ComponentPropsWithoutRef } from 'react'
  import { Position } from 'unist'

  export type ReactMarkdownProps = {
    node?: any
    children?: ReactNode[]
    sourcePosition?: Position
    index?: number
    siblingCount?: number
  }

  export type NormalComponents = {
    [TagName in keyof React.JSX.IntrinsicElements]:
      | keyof React.JSX.IntrinsicElements
      | ComponentType<ComponentPropsWithoutRef<TagName> & ReactMarkdownProps>
  }

  const ReactMarkdown: React.FC<any>
  export default ReactMarkdown
} 