import React from 'react';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

import CheckBoxSharpIcon from '@mui/icons-material/CheckBoxSharp';
import CheckBoxOutlineBlankSharpIcon from '@mui/icons-material/CheckBoxOutlineBlankSharp';
import ArrowRightSharpIcon from '@mui/icons-material/ArrowRightSharp';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';

import AcUnitSharpIcon from '@mui/icons-material/AcUnitSharp';

export default class CheckboxWidget extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        checked: [],
        expanded: [],
        nodes: props.nodes
      };
    }
    
    render() {
      return (
        <CheckboxTree
          icons={{
            check: <CheckBoxSharpIcon/>,
            uncheck: <CheckBoxOutlineBlankSharpIcon/>,      
            expandClose: <ArrowRightSharpIcon/>,
            expandOpen: <ArrowDropDownSharpIcon/>,
            expandAll: <AddSharpIcon/>,
            collapseAll: <RemoveSharpIcon/>,


            halfCheck: <AcUnitSharpIcon/>,

            parentClose: <AcUnitSharpIcon/>,
            parentOpen: <AcUnitSharpIcon/>,
            leaf: <AcUnitSharpIcon/>,
          }}
          showNodeIcon={false}
          nodes={this.state.nodes}
          checked={this.state.checked}
          expanded={this.state.expanded}
          noCascade={true}
          checkModel='leaf'
          showExpandAll={true}
          onlyLeafCheckboxes={true}
          onCheck={(checked,item) => {
            // console.log(checked)
            // console.log(item)
            this.props.onCheck({checked,item})
            this.setState({ checked })
          }}
          onExpand={expanded => this.setState({ expanded })}
        />
      );
    }
}