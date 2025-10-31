import {
  Heading,
  TextField,
  NumberField,
  Flex,
  ColorPicker,
  ColorEditor,
  TextArea,
  Text,
} from '@adobe/react-spectrum';

export const Input = ({
    type,
    name,
    label,
    value,
    onChange
}) => {
  return (
    <Flex direction="column" gap="size-100">
      <Text UNSAFE_style={{ fontWeight: 'bold' }}>{label}</Text>
      {type === 'text' && <TextField
            name={name}
            value={value}
            onChange={(value) => onChange(value)}
            width="100%"/>
      }
      {type === 'number' && <NumberField
            name={name}
            value={Number(value)}
            onChange={(value) => onChange(value.toString())}
            width="100%"/>
      }
      {type === 'color' && <ColorPicker
            value={value}
            label={value}
            onChange={(value) => onChange(value.toString('hex'))}>
                <ColorEditor />
            </ColorPicker>
      }
      {type === 'textarea' && <TextArea
            name={name}
            value={value}
            onChange={(value) => onChange(value)}
            width="100%"/>
      }
    </Flex>
  );
};