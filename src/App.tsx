import { useEffect, useRef, useState } from 'react';

import { closeWebSocket, connectWebSocket } from './api/api';
import { CryptoItem } from './components/CryptoItem';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CryptoInfo, SocketMessage } from './types/types';

const App: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<{ [key: string]: CryptoInfo }>({});
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);

  const socketRef = useRef<WebSocket | null>(null);

  const toggleFavorite = (name: string): void => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(name)
        ? prevFavorites.filter((crypto) => crypto !== name)
        : [...prevFavorites, name]
    );
  };

  const handleSocketMessage = (socketMessage: SocketMessage): void => {
    const { TYPE, FROMSYMBOL, TOSYMBOL, PRICE, OPEN24HOUR } = socketMessage;

    if (TYPE === '2') {
      setCryptoData((prev) => {
        if (OPEN24HOUR) {
          const dailyChange = ((PRICE - OPEN24HOUR) / OPEN24HOUR) * 100;

          return {
            ...prev,
            [FROMSYMBOL]: {
              name: FROMSYMBOL,
              symbol: TOSYMBOL,
              previousPrice: PRICE,
              price: PRICE,
              open24hour: OPEN24HOUR,
              previousDailyChange: dailyChange,
              dailyChange,
            },
          };
        }

        const dailyChange =
          ((PRICE - prev[FROMSYMBOL]?.open24hour) / prev[FROMSYMBOL]?.price) * 100 || 0;

        return {
          ...prev,
          [FROMSYMBOL]: {
            ...prev[FROMSYMBOL],
            name: FROMSYMBOL,
            symbol: TOSYMBOL,
            previousPrice: prev[FROMSYMBOL].price,
            price: PRICE || prev[FROMSYMBOL].price,
            previousDailyChange: prev[FROMSYMBOL].previousDailyChange,
            dailyChange,
          },
        };
      });
    }
  };

  useEffect(() => {
    const socket = socketRef.current;

    connectWebSocket(handleSocketMessage);

    return () => {
      if (socket) closeWebSocket(socket);
    };
  }, []);

  return (
    <div className='flex flex-col gap-y-8 p-4 pt-6'>
      <h1 className='text-center text-4xl font-bold'>Cryptocurrency Tracker</h1>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr>
              <th className='border p-4'>Favorite</th>
              <th className='border p-4'>#</th>
              <th className='border p-4'>Name</th>
              <th className='border p-4'>Symbol</th>
              <th className='border p-4'>Price</th>
              <th className='border p-4'>24h%</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(cryptoData).map((crypto, i) => (
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
    </div>
  );
};

export default App;
