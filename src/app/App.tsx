import { RouterProvider } from 'react-router';
import { ThemeProvider } from '@figma/astraui';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { router } from './routes';
import { AppThemeProvider } from './context/ThemeContext';
import { FieldOptionsProvider } from './context/FieldOptionsContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <AuthProvider>
            <FieldOptionsProvider>
              <AppThemeProvider>
                <ThemeProvider>
                  <RouterProvider router={router} />
                </ThemeProvider>
              </AppThemeProvider>
            </FieldOptionsProvider>
          </AuthProvider>
        </LanguageProvider>
      </I18nextProvider>
    </DndProvider>
  );
}
