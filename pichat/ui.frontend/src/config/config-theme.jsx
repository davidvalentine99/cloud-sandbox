import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import {
  Provider,
  defaultTheme,
  Heading,
  View,
  Form,
  TextField,
  NumberField,
  Button,
  Flex,
  Text,
  ProgressCircle,
  AlertDialog,
  DialogContainer,
  Well,
  Divider,
  Content,
  ColorPicker,
  ColorEditor,
  DialogTrigger,
  ActionButton,
  Dialog,
  ButtonGroup
} from '@adobe/react-spectrum';
import Settings from '@spectrum-icons/workflow/Settings';
import Label from '@spectrum-icons/workflow/Label';
import { Theme } from './index';
import { Input } from './Input';

/**
 * @typedef {Object} Configuration
 * @property {string} title
 * @property {string} popupButtonText
 * @property {string} chatbotPrompt
 * @property {string} initialMessage
 * @property {string} placeholderText
 * @property {string} chatbotName
 * @property {string} chatbotAvatar
 * @property {string} userAvatar
 * @property {string[]} themePaths
 * @property {string} pichatBackgroundCss
 * @property {string} pichatForegroundCss
 * @property {string} pichatMutedCss
 * @property {string} pichatMutedBackgroundCss
 * @property {string} pichatBorderCss
 * @property {string} pichatDestructiveCss
 * @property {string} pichatAccentCss
 * @property {string} pichatHoverCss
 * @property {string} pichatDisabledCss
 * @property {string} pichatAvatarUserBgCss
 * @property {string} pichatAvatarAiBgCss
 * @property {string} pichatScrollbarTrackCss
 * @property {string} pichatScrollbarThumbCss
 * @property {string} pichatScrollbarThumbHoverCss
 */

const DEFAULT_CONFIG = {
  title: '',
  popupButtonText: '',
  chatbotPrompt: '',
  initialMessage: '',
  placeholderText: '',
  chatbotName: '',
  chatbotAvatar: '',
  userAvatar: '',
  themePaths: ['/'],
  pichatBackgroundCss: '',
  pichatForegroundCss: '',
  pichatMutedCss: '',
  pichatMutedBackgroundCss: '',
  pichatBorderCss: '',
  pichatDestructiveCss: '',
  pichatAccentCss: '',
  pichatHoverCss: '',
  pichatDisabledCss: '',
  pichatAvatarUserBgCss: '',
  pichatAvatarAiBgCss: '',
  pichatScrollbarTrackCss: '',
  pichatScrollbarThumbCss: '',
  pichatScrollbarThumbHoverCss: '',
};

const GENERAL_CONFIG = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'popupButtonText', label: 'Popup Button Text', type: 'text' },
  { name: 'chatbotPrompt', label: 'Chatbot Prompt', type: 'text' },
  { name: 'initialMessage', label: 'Initial Message', type: 'text' },
  { name: 'placeholderText', label: 'Placeholder Text', type: 'text' },
  { name: 'chatbotName', label: 'Chatbot Name', type: 'text' },
  { name: 'chatbotAvatar', label: 'Chatbot Avatar', type: 'text' },
  { name: 'userAvatar', label: 'User Avatar', type: 'text' },
];

const STYLES_CONFIG = [
  { name: 'pichatBackgroundCss', label: 'Background Color', type: 'color' },
  { name: 'pichatMutedBackgroundCss', label: 'Muted Background Color', type: 'color' },
  { name: 'pichatBorderCss', label: 'Border Color', type: 'color' },
  { name: 'pichatForegroundCss', label: 'Foreground Color', type: 'color' },
  { name: 'pichatMutedCss', label: 'Muted Color', type: 'color' },
  { name: 'pichatAccentCss', label: 'Accent Color', type: 'color' },
  { name: 'pichatDestructiveCss', label: 'Destructive Color', type: 'color' },
  { name: 'pichatHoverCss', label: 'Hover Color', type: 'color' },
  { name: 'pichatAvatarUserBgCss', label: 'Avatar User Background Color', type: 'color' },
  { name: 'pichatAvatarAiBgCss', label: 'Avatar AI Background Color', type: 'color' },
  { name: 'pichatScrollbarTrackCss', label: 'Scrollbar Track Color', type: 'color' },
  { name: 'pichatScrollbarThumbCss', label: 'Scrollbar Thumb Color', type: 'color' },
  { name: 'pichatScrollbarThumbHoverCss', label: 'Scrollbar Thumb Hover Color', type: 'color' },
];

export function ThemeConfiguration({ theme, removeTheme }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [originalConfig, setOriginalConfig] = useState(DEFAULT_CONFIG);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadConfiguration();
  }, []);

  useEffect(() => {
    // Check if config has changed from original
    const changed = JSON.stringify(config) !== JSON.stringify(originalConfig);
    setHasChanges(changed);
  }, [config, originalConfig]);

  const loadConfiguration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/bin/pichat/config?theme=${theme.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConfig({ ...DEFAULT_CONFIG, ...data.theme });
          setOriginalConfig({ ...DEFAULT_CONFIG, ...data.theme });
        } else {
          console.warn('Failed to load configuration', data);
        }
      } else {
        console.warn('Failed to load configuration', response);
      }
    } catch (error) {
      console.warn('Error loading configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`/bin/pichat/config?theme=${theme.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken || ''
        },
        body: JSON.stringify({...config, themeName: theme.name})
      });

      if (response.ok) {
        setDialogMessage('Configuration saved successfully!');
        setOriginalConfig(config);
        setHasChanges(false);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save configuration');
      }
    } catch (error) {
      setDialogMessage(`Error saving configuration: ${error.message}`);
    } finally {
      setIsSaving(false);
      setShowDialog(true);
    }
  };

  const handleReset = () => {
    setConfig(originalConfig);
  };

  const updateConfig = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  const getCsrfToken = async () => {
    try {
      const response = await fetch('/libs/granite/csrf/token.json');
      const json = await response.json();
      return json.token;
    } catch (error) {
      console.warn('Error getting CSRF token:', error);
      return null;
    }
  };

  if (isLoading) {
    return (
      <Provider theme={defaultTheme}>
        <View padding="size-400">
          <Flex justifyContent="center" marginY="size-500">
            <ProgressCircle size="L" isIndeterminate />
          </Flex>
        </View>
      </Provider>
    );
  }

  return (
    <Provider theme={defaultTheme}>
      <View padding="size-400">
        <Form>
          <Content>
            <Flex direction="column" gap="size-200">
              <Heading level={1}>{theme.name}</Heading>
              <Divider />
              <ButtonGroup>
                <Button variant={activeTab === 'general' ? 'primary' : 'secondary'} onPress={() => setActiveTab('general')}>General</Button>
                <Button variant={activeTab === 'styles' ? 'primary' : 'secondary'} onPress={() => setActiveTab('styles')}>Styles</Button>
                <Button variant={activeTab === 'paths' ? 'primary' : 'secondary'} onPress={() => setActiveTab('paths')}>Paths</Button>
              </ButtonGroup>
              {activeTab === 'general' && <Flex direction="column" gap="size-400">
                {GENERAL_CONFIG.map((input) => (
                  <Input type={input.type} name={input.name} label={input.label} value={config[input.name]} onChange={(value) => updateConfig(input.name, value)} />
                ))}
              </Flex>}
              {activeTab === 'styles' && <Flex direction="column" gap="size-400">
                {STYLES_CONFIG.map((input) => (
                  <Input type={input.type} name={input.name} label={input.label} value={config[input.name]} onChange={(value) => updateConfig(input.name, value)} />
                ))}
              </Flex>}
              {activeTab === 'paths' && <Flex direction="column">
                <Heading level={3}>Theme Paths</Heading>
                <Flex direction="column" gap="size-400">
                  <Well>
                    <Text>
                      Configure the paths to pages where this theme will be applied.
                      <br />
                      The theme will be applied to all pages that start with the configured paths.
                      <br />
                      For example, if you configure the path /products, the theme will be applied to all pages that start with /products, such as /products/123, /products/456, etc.
                    </Text>
                  </Well>
                  <Flex direction="column" gap="size-200">
                    {config.themePaths.map((path, index) => (
                      <Flex direction="row" gap="size-200">
                        <TextField
                          value={path}
                          onChange={(value) => updateConfig('themePaths', config.themePaths.map((p, i) => i === index ? value : p))}
                          width="80%"
                        />
                        <Button variant="secondary" width="20%" onPress={() => updateConfig('themePaths', config.themePaths.filter((_, i) => i !== index))}>Remove</Button>
                      </Flex>
                    ))}
                    <Button variant="secondary" width="100%" onPress={() => updateConfig('themePaths', [...config.themePaths, '/'])}>Add</Button>
                  </Flex>
                </Flex>
              </Flex>}
            </Flex>
          </Content>

          <Flex gap="size-200" marginTop="size-300">
            <Button
              variant="cta"
              onPress={handleSave}
              isDisabled={isSaving || !hasChanges}
            >
              {isSaving ? <ProgressCircle size="S" isIndeterminate /> : 'Save Configuration'}
            </Button>
            
            <Button
              variant="secondary"
              onPress={handleReset}
              isDisabled={isSaving || !hasChanges}
            >
              Reset Changes
            </Button>
          </Flex>
            <DialogTrigger>
                <ActionButton>Remove Theme</ActionButton>
                {(close) => (
                <Dialog>
                    <Heading>Remove Theme</Heading>
                    <Divider />
                    <Content>
                    <Text>
                        Are you sure you want to remove this theme?
                    </Text>
                    </Content>
                    <ButtonGroup>
                    <Button variant="secondary" onPress={close}>Cancel</Button>
                    <Button variant="accent" onPress={() => {
                        removeTheme(theme.id);
                        close();
                    }}>Remove</Button>
                    </ButtonGroup>
                </Dialog>
                )}
            </DialogTrigger>
        </Form>

        <DialogContainer onDismiss={() => setShowDialog(false)}>
          {showDialog && (
            <AlertDialog
              title="Configuration"
              variant="information"
              primaryActionLabel="OK"
              onPrimaryAction={() => setShowDialog(false)}
            >
              {dialogMessage}
            </AlertDialog>
          )}
        </DialogContainer>
      </View>
    </Provider>
  );
}