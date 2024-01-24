import React from 'react';
import { BottomWindowWithGesture } from 'shuttlex-integration';

import HiddenPart from './HiddenPart';
import VisiblePart from './VisiblePart';

const Order = () => {
  return <BottomWindowWithGesture visiblePart={<VisiblePart />} hiddenPart={<HiddenPart />} />;
};

export default Order;
