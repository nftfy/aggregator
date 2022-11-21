import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import Image from 'next/image'
import { imageFailedFallback } from './CollectionImageFallBack'
export interface IAppProps {
  collectionAddress: string
  collectionName: string
}

export default function CollectionImage({ collectionAddress, collectionName }: IAppProps) {
  const collectionData = useCollections({ id: collectionAddress })
  const collectionInfo = collectionData.data && collectionData.data[0] ? collectionData.data[0] : undefined
  return (
    <Image
      className='rounded object-cover'
      loader={({ src }) => src}
      src={collectionInfo?.image || imageFailedFallback}
      alt={`${collectionName} Token Image`}
      width={48}
      height={48}
    />
  )
}
