import { ICryptoInfo } from '@/types/types';

import { CryptoItem } from './CryptoItem';

interface ITableProps {
  cryptoData: ICryptoInfo[];
  toggleFavorite: (name: string) => void;
  favorites: string[];
}

export const Table: React.FC<ITableProps> = ({ cryptoData, toggleFavorite, favorites }): JSX.Element => {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full table-auto border-collapse'>
        <thead>
          <tr>
            <th className='border p-4'>Favorite</th>
            <th className='border p-4'>#</th>
            <th className='border p-4'>Name</th>
            <th className='border p-4'>Price</th>
            <th className='border p-4'>24h%</th>
          </tr>
        </thead>
        <tbody>
          {cryptoData.map((crypto, i) => (
            <CryptoItem
              key={crypto.name}
              index={i + 1}
              crypto={crypto}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites.includes(crypto.name)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
