import { AlertOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, ModalProps, Space, Typography } from 'antd'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { Modal } from './Modal'

interface ModalConfirmProps extends Pick<ModalProps, 'okButtonProps'> {
  title: string
  visible?: boolean
  type: 'success' | 'warning' | 'error' | 'fail' | 'info'
  onCancel?: () => void
  onOk?: () => void
  children: ReactNode
}

const { Text } = Typography

export function ModalConfirm({ children, onCancel, onOk, title, type, visible, okButtonProps }: ModalConfirmProps) {
  return (
    <Modal onOk={onOk} closable={false} onCancel={onCancel} visible={visible} customFooter={null}>
      <FixedSpace direction='vertical' size='middle'>
        <FixedSpace align='center'>
          <IconContainer>
            {type === 'success' && <CheckCircleOutlined className='ant-modal-confirm-success' />}
            {type === 'info' && <InfoCircleOutlined className='ant-modal-confirm-info' />}
            {type === 'fail' && <AlertOutlined className='ant-modal-confirm-error' />}
            {type === 'error' && <CloseCircleOutlined className='ant-modal-confirm-error' />}
            {type === 'warning' && <WarningOutlined className='ant-modal-confirm-warning' />}
          </IconContainer>
          <Text strong>{title}</Text>
        </FixedSpace>

        <FixedSpace direction='vertical' size='middle'>
          {children}
        </FixedSpace>
        <FixedSpace direction='vertical' size='small' />
        <Button onClick={onCancel} type='primary' block {...okButtonProps}>
          {okButtonProps?.children || 'Close'}
        </Button>
      </FixedSpace>
    </Modal>
  )
}

const { IconContainer, FixedSpace } = {
  FixedSpace: styled(Space)`
    .ant-space {
      width: 100%;
    }
  `,
  IconContainer: styled.div`
    &,
    & svg {
      height: 1.3rem;
    }

    svg {
      width: 1.3rem;
    }

    .ant-modal-confirm-warning {
      color: var(--ant-warning-color);
    }

    .ant-modal-confirm-success {
      color: var(--ant-success-color);
    }

    .ant-modal-confirm-error {
      color: var(--ant-error-color);
    }

    .ant-modal-confirm-info {
      color: var(--ant-info-color);
    }
  `
}
export default ModalConfirm
