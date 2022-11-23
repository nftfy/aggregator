import { CopyOutlined, ShareAltOutlined, TwitterOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu } from 'antd'

export default function ShareButton() {
  const handleCopyAddressLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, '_blank')
  }

  const shareMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <Button icon={<CopyOutlined />} type='text' onClick={handleCopyAddressLink}>
              Copy link
            </Button>
          )
        },
        {
          key: '2',
          label: (
            <Button icon={<TwitterOutlined />} type='text' onClick={handleShareTwitter}>
              Twitter
            </Button>
          )
        }
      ]}
    />
  )

  return (
    <Dropdown overlay={shareMenu} placement='bottomRight'>
      <Button icon={<ShareAltOutlined />} type='primary' ghost shape='round'>
        Share
      </Button>
    </Dropdown>
  )
}
