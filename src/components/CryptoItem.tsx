import { getFormattedPercentage, getFormattedPrice } from '@/helpers/helpers';
import { CryptoInfo } from '@/types/types';

interface CryptoItemProps {
  crypto: CryptoInfo;
  toggleFavorite: (name: string) => void;
  isFavorite: boolean;
}

export const CryptoItem: React.FC<CryptoItemProps> = ({
  isFavorite,
  crypto,
  toggleFavorite,
}): JSX.Element => {
  return (
    <div>
      <div>{`Name: ${crypto.name}`}</div>
      <div>{`Symbol: ${crypto.symbol}`}</div>
      <div>{`Price: ${getFormattedPrice(crypto.price)}`}</div>
      <div>{`Daily Change: ${getFormattedPercentage(crypto.dailyChange)}`}</div>
      <button onClick={() => toggleFavorite(crypto.name)}>
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
      <br />
    </div>
  );
};
