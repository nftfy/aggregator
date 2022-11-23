import { Tag } from 'antd'
import styled from 'styled-components'
import ExternalLink from './ExternalLink'

type Props = {
  socialLink?: string
  icon: React.ReactNode
  children: React.ReactNode
}

function SocialLink({ socialLink, icon, children }: Props) {
  return (
    <ExternalLink href={socialLink}>
      <SocialIcon icon={icon}>{children}</SocialIcon>
    </ExternalLink>
  )
}

const { SocialIcon } = {
  SocialIcon: styled(Tag)`
    cursor: pointer;
    background-color: var(--gray-2);
    border: 1px solid var(--gray-5);
  `
}

export default SocialLink
