import { useState } from 'react';
import data from '@emoji-mart/data';
import 'emoji-mart/css/emoji-mart.css';
import Picker from '@emoji-mart/react';
import React from 'react';

export const Emoji = () => {    
  const [isPickerVisible, setPickerVisible] = useState(false);
  return <Picker data={data} />;
};
