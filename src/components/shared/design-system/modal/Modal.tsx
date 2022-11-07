import { Modal as AntModal } from 'antd'
import { ReactNode } from 'react'
import styled from 'styled-components'

interface ModalProps {
  title?: string
  visible?: boolean
  maskClosable?: boolean
  closable?: boolean
  customFooter?: ReactNode
  onCancel?: () => void
  onOk?: () => void
  children: ReactNode
  zIndex?: number
}

export function Modal({
  children,
  maskClosable = true,
  closable = true,
  customFooter,
  onCancel,
  onOk,
  title,
  visible,
  zIndex
}: ModalProps) {
  return (
    <Container
      maskTransitionName=''
      maskClosable={maskClosable}
      title={title}
      closable={closable}
      footer={customFooter}
      onCancel={onCancel}
      onOk={onOk}
      open={visible}
      zIndex={zIndex}
    >
      {children}
    </Container>
  )
}

const { Container } = {
  Container: styled(AntModal)`
    .ant-modal-body > .ant-space {
      width: 100%;
    }
  `
}
export default Modal
