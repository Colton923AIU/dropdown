import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneChoiceGroup,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import {
  BaseClientSideWebPart,
  IWebPartPropertiesMetadata,
} from '@microsoft/sp-webpart-base';

import * as strings from 'DropDownWebPartStrings';
import DropDown from './components/DropDown';
import { IDropDownProps } from './components/IDropDownProps';
import { DynamicProperty } from '@microsoft/sp-component-base';

export interface IDropDownWebPartProps {
  innerHTML: string;
  dropdownLabelColor: string;
  dropdownLabelSize: string;
  dropdownLabel: string;
  dropdownLabelFontWeight: string;
  dropdownLabelMargin: string;
  dropdownLabelPadding: string;
  iconPosition: 'Left' | 'Right';
  backgroundColor: string;
  padding: string;
  margin: string;
  iconMargin: string;
  iconSize: string;
  filterNames: string;
  filterState: DynamicProperty<{ [key: string]: boolean }>;
}

export default class DropDownWebPart extends BaseClientSideWebPart<IDropDownWebPartProps> {
  protected onInit(): Promise<void> {
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IDropDownProps> = React.createElement(
      DropDown,
      {
        innerHTML: this.properties.innerHTML ?? '',
        dropdownLabelColor: this.properties.dropdownLabelColor,
        dropdownLabelSize: this.properties.dropdownLabelSize,
        dropdownLabel: this.properties.dropdownLabel,
        dropdownLabelFontWeight: this.properties.dropdownLabelFontWeight,
        dropdownLabelMargin: this.properties.dropdownLabelMargin,
        dropdownLabelPadding: this.properties.dropdownLabelPadding,
        iconPosition: this.properties.iconPosition,
        backgroundColor: this.properties.backgroundColor,
        padding: this.properties.padding,
        margin: this.properties.margin,
        iconMargin: this.properties.iconMargin,
        iconSize: this.properties.iconSize,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get propertiesMetadata(): IWebPartPropertiesMetadata {
    return {
      filterState: {
        dynamicPropertyType: 'object',
      },
    };
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: 'General Properties',
              groupFields: [
                PropertyPaneTextField('backgroundColor', {
                  label: 'Background Color',
                  placeholder: '#ffffff',
                }),
                PropertyPaneTextField('padding', {
                  label: 'Padding',
                  placeholder: '1px',
                }),
                PropertyPaneTextField('margin', {
                  label: 'Margin',
                  placeholder: '1px',
                }),
              ],
            },
            {
              groupName: 'Label Properties',
              groupFields: [
                PropertyPaneTextField('dropdownLabelPadding', {
                  label: 'Padding',
                  placeholder: '1px',
                }),
                PropertyPaneTextField('dropdownLabelMargin', {
                  label: 'Margin',
                  placeholder: '1px',
                }),
                PropertyPaneTextField('dropdownLabel', {
                  label: 'Drop Down Label',
                }),
                PropertyPaneChoiceGroup('dropdownLabelSize', {
                  label: 'Label Size',
                  options: [
                    {
                      key: '10px',
                      text: '10px',
                    },
                    {
                      key: '12px',
                      text: '12px',
                    },
                    {
                      key: '14px',
                      text: '14px',
                    },
                    {
                      key: '16px',
                      text: '16px',
                    },
                    {
                      key: '18px',
                      text: '18px',
                    },
                    {
                      key: '20px',
                      text: '20px',
                    },
                    {
                      key: '24px',
                      text: '24px',
                    },
                    {
                      key: '28px',
                      text: '28px',
                    },
                    {
                      key: '32px',
                      text: '32px',
                    },
                  ],
                }),
                PropertyPaneTextField('dropdownLabelColor', {
                  label: 'Label Color',
                  placeholder: '#000000',
                }),
                PropertyPaneChoiceGroup('dropdownLabelFontWeight', {
                  label: 'Font Weight',
                  options: [
                    {
                      key: 'lighter',
                      text: 'lighter',
                    },
                    {
                      key: 'light',
                      text: 'light',
                    },
                    {
                      key: 'normal',
                      text: 'normal',
                    },
                    {
                      key: 'bold',
                      text: 'bold',
                    },
                    {
                      key: 'bolder',
                      text: 'bolder',
                    },
                  ],
                }),
              ],
            },

            {
              groupName: 'Icon Properties',
              groupFields: [
                PropertyPaneChoiceGroup('iconPosition', {
                  options: [
                    {
                      key: 'Left',
                      text: 'Left',
                    },
                    {
                      key: 'Right',
                      text: 'Right',
                    },
                  ],
                }),
                PropertyPaneTextField('iconMargin', {
                  label: 'Icon Margin',
                  placeholder: '0px',
                }),
                PropertyPaneTextField('iconSize', {
                  label: 'Icon Size',
                  placeholder: '30px',
                }),
              ],
            },
            {
              groupName: 'Markdown',
              groupFields: [
                PropertyPaneTextField('innerHTML', {
                  label: 'Inner HTML',
                  multiline: true,
                  resizable: true,
                  placeholder: `# Markdown Example with Link

This is an example of markdown text that includes a link to a SharePoint site.

Visit our SharePoint site for more information: [Live Career Ed](https://www.livecareered.sharepoint.com)

## Additional Content

- **Bold text**
- _Italic text_`,
                }),
                PropertyPaneTextField('filterNames', {
                  label: 'Filter Icon Names (comma separated)',
                  placeholder: 'mil, aius',
                }),
              ],
            },
          ],
        },
      ],
    };
  }

  protected get disableReactivePropertyChanges(): boolean {
    // set property changes mode to reactive, so that the Bing Maps API is not
    // called on each keystroke when typing in the address to show on the map
    // in web part properties
    return true;
  }
}
