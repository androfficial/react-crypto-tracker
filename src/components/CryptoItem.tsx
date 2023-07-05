import { ReactComponent as StarFillIcon } from '@/assets/star-fill.svg';
import { ReactComponent as StarStrokeIcon } from '@/assets/star-stroke.svg';
import { getFormattedPercentage, getFormattedPrice } from '@/helpers/helpers';
import { ICryptoInfo } from '@/types/types';

interface ICryptoItemProps {
  index: number;
  crypto: ICryptoInfo;
  toggleFavorite: (name: string) => void;
  isFavorite: boolean;
}

export const CryptoItem: React.FC<ICryptoItemProps> = ({ index, crypto, toggleFavorite, isFavorite }): JSX.Element => {
  const isPriceDecreased = crypto.price < crypto.previousPrice;
  const isPriceIncreased = crypto.price > crypto.previousPrice;

  const isPercentageDecreased = crypto.dailyChange < crypto.previousDailyChange;
  const isPercentageIncreased = crypto.dailyChange > crypto.previousDailyChange;

  const priceColorClass = isPriceDecreased ? 'text-red-500' : isPriceIncreased ? 'text-green-500' : 'text-black-500';

  const percentageColorClass = isPercentageDecreased
    ? 'text-red-500'
    : isPercentageIncreased
    ? 'text-green-500'
    : 'text-black-500';

  return (
    <tr className='border-b bg-gray-100 text-center font-semibold text-cyan-700'>
      <td className='flex items-center justify-center border border-b-0 border-t-0 p-4'>
        <button onClick={() => toggleFavorite(crypto.name)} className='flex items-center justify-center'>
          {isFavorite ? <StarFillIcon width={32} height={32} /> : <StarStrokeIcon width={32} height={32} />}
        </button>
      </td>
      <td className='text-black-500 w-1/5 border p-4'>{index}</td>
      <td className='text-black-500 w-1/5 border p-4'>{crypto.name}</td>
      <td className={`w-1/4 border p-4 ${priceColorClass}`}>{getFormattedPrice(crypto.price)}</td>
      <td className={`w-1/4 border p-4 ${percentageColorClass}`}>{getFormattedPercentage(crypto.dailyChange)}</td>
    </tr>
  );
};
