import * as React from 'react';
import styles from './DropDown.module.scss';
import type { IDropDownProps } from './IDropDownProps';
import Intersection from '../../../components/Intersection/Intersection';
import Chevron from '../../../components/Chevron/Chevron';
import { marked } from 'marked';
const DropDown: React.FC<IDropDownProps> = props => {
  const {
    dropdownLabel,
    dropdownLabelColor,
    dropdownLabelSize,
    backgroundColor,
    iconPosition,
    margin,
    padding,
    iconMargin,
    iconSize,
    dropdownLabelFontWeight,
    dropdownLabelMargin,
    dropdownLabelPadding,
    innerHTML,
  } = props;

  const [clicked, setClicked] = React.useState<boolean>(false);
  const [editedHTML, setEditedHTML] = React.useState<string>('');
  const [filterState, setFilterState] = React.useState<Record<string, boolean>>(
    {}
  );

  const markHTML = async (html: string) => {
    const res = await marked(html);
    setEditedHTML(res); // Update the state with the modified HTML
  };

  const updateHTML = (filter: Record<string, boolean>) => {
    let html = innerHTML; // Start with the original HTML

    // Loop through all the filters and process the HTML accordingly
    Object.keys(filter).forEach(key => {
      const filterTagRegex = new RegExp(
        `(<${key}[^>]*>)([\\s\\S]*?)(</${key}>)`, // Capture elements, excluding comments
        'g'
      );

      if (filter[key]) {
        // Show content: Keep the element and its content
        html = html.replace(filterTagRegex, '$1$2$3');
      } else {
        // Hide content: Remove the element and its content
        html = html.replace(filterTagRegex, '');
      }
    });

    void markHTML(html); // Call markHTML to process the HTML content
  };

  // Function to update filter state and innerHTML
  const handleFilterStateChange = (filterName: string) => {
    if (!filterName) return; // Skip if filterName is undefined
    setFilterState(prevState => {
      if (prevState[filterName] !== undefined) {
        const newFilterState = {
          ...prevState,
          [filterName]: !prevState[filterName],
        };
        updateHTML(newFilterState);
        return newFilterState;
      } else {
        const newFilterState = {
          ...prevState,
          [filterName]: true,
        };
        return newFilterState;
      }
    });
  };
  // Event handler for filter toggling
  const onFilterToggled = (event: any) => {
    const filterName = event.detail.filterName;
    handleFilterStateChange(filterName);
  };

  // Register the `filterToggled` event listener
  React.useEffect(() => {
    console.log('filterState: ', filterState);
    if (editedHTML === '') {
      void markHTML(innerHTML);
    }
    window.addEventListener('filterToggled', onFilterToggled);
    return () => {
      window.removeEventListener('filterToggled', onFilterToggled);
    };
  }, [innerHTML]);

  const fontWeight = (weight: string) => {
    switch (weight) {
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
        onClick={() => setClicked(!clicked)}
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
            <div
              dangerouslySetInnerHTML={{ __html: editedHTML }}
              key={editedHTML}
            />
          </div>
        </Intersection>
      ) : null}
    </div>
  );
};

export default DropDown;
