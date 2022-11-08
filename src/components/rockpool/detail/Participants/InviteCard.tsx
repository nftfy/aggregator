import { CopyOutlined } from '@ant-design/icons'
import { Button, Card } from 'antd'

interface InviteCardProps {
  owner: boolean
}

export default function InviteCard({ owner }: InviteCardProps) {
  const handleCopyAddressLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  return (
    <Card style={{ width: '100%' }}>
      <p>
        {owner
          ? `You're the first! Invite more friends to close the pool`
          : `Hey, come on! Join this pool and invite other friends to complete it!`}
      </p>
      <Button danger icon={<CopyOutlined />} style={{ width: '100%', height: '40px' }} onClick={handleCopyAddressLink}>
        Copy link
      </Button>
    </Card>
  )
}
