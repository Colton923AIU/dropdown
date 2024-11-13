import * as React from 'react';
import styles from './DropDown.module.scss';
import type { IDropDownProps } from './IDropDownProps';
import { marked } from 'marked';
import Intersection from '../../../components/Intersection/Intersection';
import Chevron from '../../../components/Chevron/Chevron';

const DropDown: React.FC<IDropDownProps> = props => {
  const {
    dropdownLabel,
    dropdownLabelColor,
    dropdownLabelSize,
    innerHTML,
    backgroundColor,
    iconPosition,
    margin,
    padding,
    iconMargin,
    iconSize,
    dropdownLabelFontWeight,
    dropdownLabelMargin,
    dropdownLabelPadding,
    filterNames,
    globalStateService,
  } = props;

  const [goodHTML, setGoodHTML] = React.useState<string>('');
  const [clicked, setClicked] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleStateChange = (newState: boolean, filterName: string) => {
      console.log(
        'handling filtered state change: ',
        'newState: ',
        newState,
        'filterName: ',
        filterName
      );
      const filterTagContent = new RegExp(
        `<!--\\s*<${filterName}>\\s*-->([\\s\\S]*?)<!--\\s*</${filterName}>\\s*-->`,
        'g'
      );

      let updatedHTML = goodHTML;

      if (newState) {
        // Show content inside filter tags by removing the tags and retaining only the inner content
        updatedHTML = updatedHTML.replace(filterTagContent, '$1');
      } else {
        // Hide content by adding the comment syntax back around the filter tags
        updatedHTML = updatedHTML
          .replace(new RegExp(`<${filterName}>`, 'g'), `<!-- <${filterName}>`)
          .replace(new RegExp(`</${filterName}>`, 'g'), `</${filterName}> -->`);
      }

      setGoodHTML(updatedHTML);
    };

    // Subscribe to each filter's state change
    filterNames.split(',').forEach(filter => {
      console.log('subscribing filter: ', filter.trim());
      globalStateService.subscribe(filter.trim(), newState =>
        handleStateChange(newState, filter.trim())
      );
    });

    const setHTMLContent = async () => {
      const result = await marked(innerHTML || '');
      setGoodHTML(result);
    };

    setHTMLContent();
  }, [innerHTML, filterNames, globalStateService]);

  const fontWeight = (dropdownLabelFontWeight: string) => {
    switch (dropdownLabelFontWeight) {
      case 'lighter':
        return 200;
      case 'light':
        return 400;
      case 'normal':
        return 500;
      case 'bold':
        return 600;
      case 'bolder':
        return 800;
      default:
        return 500;
    }
  };

  return (
    <div
      className={styles.dropDown}
      style={{
        margin: margin,
        padding: padding,
        backgroundColor:
          backgroundColor === '' ? 'transparent' : backgroundColor,
      }}
    >
      <div
        className={styles.dropDownController}
        style={{
          flexDirection: iconPosition === 'Left' ? 'row' : 'row-reverse',
        }}
        onClick={() => {
          setClicked(!clicked);
        }}
      >
        <div className={clicked ? styles.rotateIcon : styles.icon}>
          <Chevron
            iconMargin={iconMargin}
            iconWidth={iconSize}
            iconHeight={iconSize}
          />
        </div>
        <div
          className={styles.label}
          style={{
            color: dropdownLabelColor || 'black',
            fontSize: dropdownLabelSize || '20px',
            fontWeight: fontWeight(dropdownLabelFontWeight),
            margin: dropdownLabelMargin,
            padding: dropdownLabelPadding,
          }}
        >
          {dropdownLabel}
        </div>
      </div>
      {clicked ? (
        <Intersection>
          <div className={styles.content}>
            <div dangerouslySetInnerHTML={{ __html: goodHTML }} />
          </div>
        </Intersection>
      ) : null}
    </div>
  );
};

export default DropDown;
