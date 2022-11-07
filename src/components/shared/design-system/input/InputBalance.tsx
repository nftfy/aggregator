import { Button, Form, Input, Typography } from 'antd'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { toHumanFormat } from '../../../../services/UtilService'

const { Text } = Typography

export interface InputBalanceProps {
  label: string
  formName: string
  onChange: (value: string) => void
  onClick: () => void
  addonBefore: ReactNode
  prefix: ReactNode
  value: string
  placeholder: string
  help?: string
  balance?: string
  isBalanceLoading?: boolean
  disabled?: boolean
}

export function InputBalance({
  label,
  value,
  formName,
  placeholder,
  addonBefore,
  prefix,
  help,
  isBalanceLoading,
  balance,
  onChange,
  onClick,
  disabled
}: InputBalanceProps) {
  return (
    <FormContainer name={formName} layout='vertical'>
      <Form.Item
        label={label}
        name='balance'
        wrapperCol={{ span: 24 }}
        extra={
          balance && (
            <Text type='secondary'>
              {isBalanceLoading ? 'loading...' : `Balance: ${toHumanFormat(Number(balance))} `}
              {addonBefore}
            </Text>
          )
        }
        help={help}
        validateStatus={help ? 'error' : undefined}
      >
        <InputGroup compact size='large'>
          <Input
            type='number'
            prefix={prefix}
            addonBefore={addonBefore}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            min={0}
            onChange={event => {
              onChange(event.target.value)
            }}
          />
          <Button disabled={disabled} size='large' onClick={onClick} danger={!!help}>
            <Text type={help ? 'danger' : undefined}>Use max</Text>
          </Button>
        </InputGroup>
      </Form.Item>
    </FormContainer>
  )
}

const { FormContainer, InputGroup } = {
  FormContainer: styled(Form)`
    .ant-form-item-with-help .ant-form-item-explain {
      min-height: 0;
    }
  `,
  InputGroup: styled(Input.Group)`
    display: flex !important;

    .ant-input-group-wrapper {
      > .ant-input-wrapper {
        height: 100% !important;
      }

      .ant-input-affix-wrapper {
        height: 100% !important;
        border-top-right-radius: unset;
        border-bottom-right-radius: unset;
      }
    }
  `
}
