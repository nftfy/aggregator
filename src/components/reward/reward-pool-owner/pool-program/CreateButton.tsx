import { PlusOutlined } from '@ant-design/icons'
import { useReactiveVar } from '@apollo/client'
import { Button } from '@components/shared/design-system/Button'
import { walletAccountVar } from '@nftfyorg/wallet'
import { Tooltip } from 'antd'
import { useState } from 'react'
import { PoolProgramChooseType, TokenTypeEnum } from './ChooseTypeModal'
import { PoolProgramModal } from './ProgramModal'

interface PoolProgramCreateButtonProps {
  chainId: number
  disabled?: boolean
}

enum ActiveModalEnum {
  DEFAULT = 'default',
  CREATE = 'create'
}

export function PoolProgramCreateButton({ chainId, disabled }: PoolProgramCreateButtonProps) {
  const walletAccount = useReactiveVar(walletAccountVar)

  const [activeModal, setActiveModal] = useState<ActiveModalEnum | TokenTypeEnum>(ActiveModalEnum.DEFAULT)

  const handleInit = () => {
    setActiveModal(ActiveModalEnum.CREATE)
  }

  const handleChangeActiveModal = (tokenType: TokenTypeEnum) => {
    setActiveModal(tokenType)
  }

  const handleClose = () => {
    setActiveModal(ActiveModalEnum.DEFAULT)
  }

  return (
    <>
      <Tooltip title={!walletAccount?.length && 'Connect your wallet to create a program'}>
        <Button type='primary' disabled={!walletAccount?.length || disabled} ghost icon={<PlusOutlined />} onClick={handleInit}>
          Create Program
        </Button>
      </Tooltip>

      {activeModal === ActiveModalEnum.CREATE && (
        <PoolProgramChooseType
          visible={activeModal === ActiveModalEnum.CREATE}
          onSelectType={handleChangeActiveModal}
          onCancel={handleClose}
        />
      )}

      {Object.keys(TokenTypeEnum).includes(activeModal) && (
        <PoolProgramModal tokenType={activeModal as TokenTypeEnum} chainId={chainId} onCancel={handleClose} />
      )}
    </>
  )
}
