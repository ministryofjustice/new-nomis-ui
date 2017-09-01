import React,{PureComponent} from 'react';
import styled from 'styled-components';
import Datetime from 'react-datetime';
import moment from 'moment';
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

export const DateTimePickerDisplay = ({locale,onDateTimeChange,toggleEdit,isValidDate}) =>(
<div>
  <DateTimeElement
    className="date-time-picker"
    isValidDate={isValidDate}
    input={false}
    locale={locale}
    onChange={onDateTimeChange}
    defaultValue={moment()}
  />
  <DateTimeCancelButton className="cancel-button" onClick={toggleEdit}>
    Finish editing
  </DateTimeCancelButton>

</div>)

export const ReadOnlyDateTimeView = ({dateTimeText,toggleEdit,shouldShowDay}) =>(
<div>
    <DateTimeAndLink>
      <span className="date-time-text">{dateTimeText}</span>
      <a href="#" onClick={toggleEdit}>Edit</a>
    </DateTimeAndLink>
</div>)

class DateTimePicker extends PureComponent{

  constructor(){
    super();

    this.toggleEdit = this.toggleEdit.bind(this);
    this.onDateTimeChange = this.onDateTimeChange.bind(this);
    this.outputResult = this.outputResult.bind(this);

    const momentSnapShot = moment();

    this.state = {
      edit: false,
      date: momentSnapShot.format(DEFAULT_MOMENT_DATE_FORMAT_SPEC),
      time: momentSnapShot.format(DEFAULT_MOMENT_TIME_FORMAT_SPEC),
      momentSnapShot
    };

  }

  componentDidMount(){

    const {momentSnapShot} = this.state;
    this.outputResult(momentSnapShot.toISOString());
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
      momentSnapShot: moment
    });

    this.outputResult(moment.toISOString());
  }

   outputResult(value){

    if(this.props && this.props.input && this.props.input.onChange)
      this.props.input.onChange(value);
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
          <DateTimePickerDisplay
            toggleEdit={this.toggleEdit}
            locale={locale}
            onDateTimeChange={this.onDateTimeChange}
            isValidDate={shouldShowDay}

          /> :
          <ReadOnlyDateTimeView toggleEdit={this.toggleEdit} dateTimeText={dateTimeText} />
        }

       </div>
    );
  }
}

export default DateTimePicker;