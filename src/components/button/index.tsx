import { DialogButton, DialogButtonProps } from 'decky-frontend-lib'
import { FC } from 'react'

export type ButtonProps = DialogButtonProps

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Button = (DialogButton as any).render({}).type as FC<ButtonProps>
