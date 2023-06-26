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
          return {
            ...prev,
            [FROMSYMBOL]: {
              name: FROMSYMBOL,
              symbol: TOSYMBOL,
              price: PRICE,
              open24hour: OPEN24HOUR,
              dailyChange: ((PRICE - OPEN24HOUR) / OPEN24HOUR) * 100,
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
            price: PRICE,
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
    <div>
      {Object.values(cryptoData).map((crypto) => (
        <CryptoItem
          key={crypto.name}
          crypto={crypto}
          toggleFavorite={toggleFavorite}
          isFavorite={favorites.includes(crypto.name)}
        />
      ))}
    </div>
  );
};

export default App;
