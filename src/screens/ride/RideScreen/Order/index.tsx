import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { BottomWindowWithGesture } from 'shuttlex-integration';
import { BottomWindowWithGestureRef } from 'shuttlex-integration/lib/typescript/src/shared/molecules/BottomWindowWithGesture/props';

import { tripStatusSelector } from '../../../../core/ride/redux/trip/selectors';
import HiddenPart from './HiddenPart';
import VisiblePart from './VisiblePart';

const Order = () => {
  const [isOpened, setIsOpened] = useState(false);
  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);
  const tripStatus = useSelector(tripStatusSelector);

  useEffect(() => {
    bottomWindowRef.current?.closeWindow();
  }, [tripStatus]);

  return (
    <BottomWindowWithGesture
      visiblePart={<VisiblePart isOpened={isOpened} />}
      hiddenPart={<HiddenPart />}
      setIsOpened={setIsOpened}
      ref={bottomWindowRef}
    />
  );
};

export default Order;
