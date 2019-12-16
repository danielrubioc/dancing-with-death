<?php

namespace App\Http\Controllers;

use App\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $appointment =  Appointment::orderBy('date', 'DESC')->orderBy('start_time', 'DESC')
                        ->paginate(env('LIMIT_PAGINATION', 10)); 
        return response()->json($appointment, 200);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {   
        $request->validate([
            'contact_information' => 'required',
            'date'  => 'required|date',
            'start_time' => 'required|integer|between:9,17|unique:appointments,start_time,NULL,id,date,'.$request->date,
        ]);
        $appointment = new Appointment($request->all());
        if ($appointment->save()) {
            return response()->json(['message' => "Your appointment was created, prepare your best dance steps, death awaits you eagerly", 'data' => $appointment ], 202);
        } else {
            return response()->json(['message' => "appointments not created"], 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Appointment  $appointment
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $appointment = Appointment::findOrFail($id);
        return response()->json($appointment, 200);
    }

    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Appointment  $appointment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $appointment= Appointment::find($id);
        $appointment->fill($request->all());
        if ($appointment->save()) {
 
            return response()->json(['message' => "Your appointment was updated, prepare your best dance steps, death awaits you anxiously", 'data' => $appointment], 201);
        } else {
            return response()->json(['message' => "Your appointment could not be updated"], 400);
        }
    }

    /**
     * Remove the speci //fied resource from storage.
     *
     * @param  \App\Appointment  $appointment
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $appointment = Appointment::find($id);
        if ($appointment->delete()) {
            return response()->json(['message' => "Appointment deleted"], 204);
        } else {
            return response()->json(['message' => "register not deleted"], 400);
        }
    }

     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function timesAvaibles(Request $request)
    {
        $range =  [ [ "name" => "9:00",  "value"=>  9], 
                    ["name"=>  "10:00",  "value"=>  10],
                    ["name"=>  "11:00",  "value"=>  11],
                    ["name"=>  "12:00",  "value"=>  12],
                    ["name"=>  "13:00",  "value"=>  13],
                    ["name"=>  "14:00",  "value"=>  14],
                    ["name"=>  "15:00",  "value"=>  15],
                    ["name"=>  "16:00",  "value"=>  16],
                    ["name"=>  "17:00",  "value"=>  17]];
        $range_srt =  $range;
        $date = $request->input('date');
        $appointment = Appointment::where('date', $date)->pluck('start_time')->toArray();
 
        if ($appointment) {
            foreach ($appointment as $k => $time) {
                $found_key = array_search($time, array_column($range, 'value'));
                if ( $found_key !== NULL ) {
                    unset($range_srt[$found_key]); 
                }
            }
        }

        return response()->json(array_values($range_srt));
    }


    
}
