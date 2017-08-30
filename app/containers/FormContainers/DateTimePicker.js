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
    const {locale,title} = this.props;
    const {edit,date,time} = this.state;
    const dateTimeDisplay = date ? `${date}  -  ${time}` : '';

    return (
      <div>
        <label className="form-label">
          {title}
        </label>
        {edit ?
          <div>
            <DateTimeElement input={false} locale={locale} onChange={this.onDateTimeChange} className="date-time-picker"/>
            <DateTimeCancelButton className="cancel-button" onClick={this.toggleEdit}>
              Finish editing
            </DateTimeCancelButton>

          </div>
          :
          <div>
              <div>
                <DateTimeAndLink>
                   <span>{dateTimeDisplay}</span>
                   <a href="#" onClick={this.toggleEdit}>Edit</a>
                </DateTimeAndLink>
              </div>
          </div>
        }
       </div>
    );
  }
}

export default DateTimePicker;