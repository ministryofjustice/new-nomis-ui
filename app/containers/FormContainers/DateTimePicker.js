import React,{PureComponent} from 'react';
import styled from 'styled-components';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import {
  DEFAULT_MOMENT_DATE_FORMAT_SPEC,
  DEFAULT_MOMENT_TIME_FORMAT_SPEC
} from 'containers/App/constants';


const DateTimeElement = styled(Datetime) `  
   .rdtPicker{
     width:100%;
   }   
   .rdtBtn{
     font-size: 2rem;
   }
`;

const DateTimeCancelButton = styled.button`
   margin-top: 1em;
`

const DateTimeAndLink = styled.span`
   span{
     font-weight: bold;
     margin-right:1em;
   }
`

const EditMode = ({locale,onDateTimeChange,toggleEdit,isValidDate}) =>(
<div>
  <DateTimeElement isValidDate={isValidDate} input={false} locale={locale} onChange={onDateTimeChange} className="date-time-picker"/>
  <DateTimeCancelButton className="cancel-button" onClick={toggleEdit}>
    Finish editing
  </DateTimeCancelButton>

</div>)

const DisplayMode = ({dateTimeText,toggleEdit,shouldShowDay}) =>(
<div>
  <div>
    <DateTimeAndLink>
      <span>{dateTimeText}</span>
      <a href="#" onClick={toggleEdit}>Edit</a>
    </DateTimeAndLink>
  </div>
</div>)

class DateTimePicker extends PureComponent{

  constructor(){
    super();
    this.toggleEdit = this.toggleEdit.bind(this);
    this.onDateTimeChange = this.onDateTimeChange.bind(this);

    this.state = {
      edit: false,
      date: '',
      time: ''
    };
  }

  toggleEdit(e){
     e.preventDefault();
     this.setState({
       edit: ! this.state.edit
     });
  }

  onDateTimeChange(moment){

    this.setState({...this.state,
      date: moment.format(DEFAULT_MOMENT_DATE_FORMAT_SPEC),
      time: moment.format(DEFAULT_MOMENT_TIME_FORMAT_SPEC),
    });

    const dateTimeFormat = moment.toISOString();

    this.props.input.onChange(dateTimeFormat);
  }

  render(){
    const {locale,title,meta:{touched,error},shouldShowDay} = this.props;
    const {edit,date,time} = this.state;
    const dateTimeText = date ? `${date}  -  ${time}` : '';

    return (
      <div className={ !(touched && error) ? 'form-group' : 'form-group form-group-error'}>

        <label className="form-label">
          {title}
        </label>

        <div className="error-message">
          {touched && ((error && <span>{error}</span>))}
        </div>

        {edit ?
          <EditMode
            toggleEdit={this.toggleEdit}
            locale={locale}
            onDateTimeChange={this.onDateTimeChange}
            isValidDate={shouldShowDay}

          /> :
          <DisplayMode toggleEdit={this.toggleEdit} dateTimeText={dateTimeText} />
        }

       </div>
    );
  }
}

export default DateTimePicker;