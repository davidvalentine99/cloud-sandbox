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
  ButtonGroup,
  Header
} from '@adobe/react-spectrum';
import Settings from '@spectrum-icons/workflow/Settings';
import Label from '@spectrum-icons/workflow/Label';
import { ThemeConfiguration } from './config-theme';

/**
 * @typedef {Object} Theme
 * @property {string} name
 * @property {string} id
 * @property {boolean} active
 */

function ConfigurationPage() {
  const [themes, setThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newThemeName, setNewThemeName] = useState('');

  useEffect(() => {
    loadThemes();
  }, []);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  };

  const loadThemes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/bin/pichat/config?theme=all');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('data 2', data);
          setThemes(data.themes);
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

  const removeTheme = async (id) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`/bin/pichat/config?theme=${id}&remove=true`, {
        method: 'POST',
        headers: {
          'CSRF-Token': csrfToken || ''
        }
      });

      if (response.ok) {
        setThemes(themes.filter(t => t.id !== id));
      } else {
        console.warn('Failed to remove theme', response);
      }
    } catch (error) {
      console.warn('Error removing theme:', error);
    }
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
        <Heading level={1}>
          <Flex alignItems="center" gap="size-200">
            <Settings size="L" />
            <Text>Chatbot Configuration (Cloud)</Text>
          </Flex>
        </Heading>
        <Flex direction="column" gap="size-200">
          <Heading level={3}>Themes</Heading>
          <Flex direction="row" gap="size-100" id="chatbot-themes" maxHeight="size-3000" UNSAFE_style={{ overflowY: 'auto' }}>
            {themes.map((theme, index) => (
              <Flex direction="row" gap="size-200">
                <ButtonGroup>
                  <Button
                    variant="secondary"
                    style={ theme.active ? 'fill' : 'outline' }
                    onPress={() => setThemes(themes.map((t, i) => ({ ...t, active: i === index })))}
                  >{theme.name}</Button>
                </ButtonGroup>
              </Flex>
            ))}
            <DialogTrigger>
              <ActionButton>Add Theme</ActionButton>
              {(close) => (
                <Dialog>
                  <Heading>Add Theme</Heading>
                  <Divider />
                  <Content>
                    <TextField
                      label="Theme Name"
                      value={newThemeName}
                      onChange={(value) => setNewThemeName(value)}
                      width="100%"
                      isRequired
                      type="text"
                    />
                  </Content>
                  <ButtonGroup>
                    <Button variant="secondary" onPress={() => {
                      setNewThemeName('');
                      close();
                    }}>Cancel</Button>
                    <Button variant="accent" onPress={() => {
                      const newThemeId = generateId();
                      const newTheme = { name: newThemeName, id: newThemeId, active: false };
                      
                      // Add the new theme and set it as active in a single state update
                      setThemes(prevThemes => {
                        const updatedThemes = [...prevThemes, newTheme];
                        return updatedThemes.map((t, i) => ({ 
                          ...t, 
                          active: i === updatedThemes.length - 1 
                        }));
                      });
                      
                      setNewThemeName('');
                      close();
                    }}>Create</Button>
                  </ButtonGroup>
                </Dialog>
              )}
            </DialogTrigger>
          </Flex>
        </Flex>

        {themes.map((theme) => (
          <div id={theme.id} style={{ display: theme.active ? 'block' : 'none' }}>
            <ThemeConfiguration key={theme.id} theme={theme} removeTheme={removeTheme} />
          </div>
        ))}
      </View>
    </Provider>
  );
}

// Mount the app
const root = document.getElementById('root');
if (root) {
  render(<ConfigurationPage />, root);
}