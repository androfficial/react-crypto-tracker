import { useEffect, useRef, useState } from 'react';

import { closeWebSocket, connectWebSocket } from './api/api';
import { Table } from './components/Table';
import { useFavoriteCryptos } from './hooks/useFavoriteCryptos';
import { ICryptoInfo, ISocketMessage } from './types/types';

const App: React.FC = () => {
  const { favorites, setFavorites } = useFavoriteCryptos();
  const [cryptoData, setCryptoData] = useState<{ [key: string]: ICryptoInfo }>({});

  const socketRef = useRef<WebSocket | null>(null);

  const toggleFavorite = (name: string): void => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(name)
        ? prevFavorites.filter((crypto) => crypto !== name)
        : [...prevFavorites, name]
    );
  };

  const favoriteCryptoData = Object.values(cryptoData).filter((crypto) =>
    favorites.includes(crypto.name)
  );

  const handleSocketMessage = (socketMessage: ISocketMessage): void => {
    const { TYPE, FROMSYMBOL, PRICE, OPEN24HOUR } = socketMessage;

    if (TYPE === '2') {
      setCryptoData((prev) => {
        if (OPEN24HOUR) {
          const dailyChange = ((PRICE - OPEN24HOUR) / OPEN24HOUR) * 100;

          return {
            ...prev,
            [FROMSYMBOL]: {
              name: FROMSYMBOL,
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
    <div className='flex flex-col gap-y-12 p-4 pt-6'>
      <div className='flex flex-col gap-y-8'>
        <h1 className='text-center text-4xl font-bold'>Cryptocurrency Tracker</h1>
        <Table
          cryptoData={Object.values(cryptoData)}
          toggleFavorite={toggleFavorite}
          favorites={favorites}
        />
      </div>
      {favoriteCryptoData.length > 0 && (
        <div className='flex flex-col gap-y-8'>
          <h1 className='text-center text-4xl font-bold'>Favorites</h1>
          <Table
            cryptoData={favoriteCryptoData}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
          />
        </div>
      )}
    </div>
  );
};

export default App;
