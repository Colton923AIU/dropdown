import { GlobalStateService } from '../context/GlobalStateService';

export interface IDropDownProps {
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
  globalStateService: GlobalStateService;
}
