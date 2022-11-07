import styled from 'styled-components'

const { ExternalLink } = {
  ExternalLink: styled.a`
    text-decoration: none;
    display: flex;
    flex-direction: row;
    align-items: center;
  `
}

ExternalLink.defaultProps = {
  target: '_blank',
  rel: 'noreferrer'
}

export default ExternalLink
