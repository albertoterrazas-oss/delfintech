import Datatable from "./Datatable"
import ButtonComp from "./ui/ButtonComp"

export const FieldDrawer = ({ fields = [], errors = [] }) => {
    return (

        fields && fields.map((field, key) => {
            if (field._fieldInfo)
                console.log("field info", field)
            if (field._conditional) {
                if (!field._conditional(field))
                    return <div key={key} className={`grid max-[640px]:col-span-full grid-cols-1 gap-1 ${field.style}`}></div>
            }
            if (field._debug) {
                field._debug({ field })
            }
            if (field.input) {
                return (
                    <div key={key} className={`grid max-[640px]:col-span-full grid-cols-1 gap-1 ${field.style}`}>
                        <TextInput
                            label={field.label}
                            className={"block w-full mt-1 texts"}
                            maxLength={field.maxLength}
                            type={field.type}
                            value={field.value}
                            onChange={field.onChangeFunc}
                            disabled={field.disabled}
                            customIcon={field.customIcon}
                            max={field.max}
                            min={field.min}
                            ref={field.ref}
                            overwrite={field.overwrite}
                            autoComplete={field.autoComplete}
                            onlyUppercase={field.onlyUppercase}
                            allowAsci={field.allowAsci}
                        // readOnly={field.readOnly}
                        />

                        {errors[field.fieldKey] && (
                            <span className="text-red-600">
                                {errors[field.fieldKey]}
                            </span>
                        )}
                    </div>

                )
            }
            if (field.select) {
                return (
                    <div key={key} className={`grid max-[640px]:col-span-full grid-cols-1 gap-1 ${field.style}`}>
                        <SelectComp
                            label={field.label}
                            value={field.value}
                            onChangeFunc={field.onChangeFunc}
                            options={field.options}
                            data={field.data}
                            valueKey={field.valueKey}
                            disabled={field.disabled}
                            disableClearable={field.disableClearable}
                            virtual={field.virtual}
                            firstOption={field.firstOption}
                            firstLabel={field.firstLabel}
                            small={field.small}
                            ref={field.ref}
                        />
                        {errors[field.fieldKey] && (
                            <span className="text-red-600">
                                {errors[field.fieldKey]}
                            </span>
                        )}
                    </div>
                )
            }
            if (field.custom) {
                return (
                    <div key={key} className={`grid max-[640px]:col-span-full grid-cols-1 gap-1 ${field.style}`}>
                        {
                            field.customItem && field.customItem({ ...field })
                            // <field.customItem
                            //     label={field.label}
                            //     value={field.value}
                            //     errors={errors}
                            //     data={field.data}
                            //     onChangeFunc={field.onChangeFunc}
                            //     {...field}
                            // />
                        }
                    </div>
                )
            }
            // if (field.check) {
            //     return (
            //         <div key={key} className={`max-[640px]:col-span-full flex gap-1 mt-2  ${field.style}`}>
            //             <FormControlLabel
            //                 label={field.label}
            //                 labelPlacement={field.labelPlacement || 'end'}
            //                 defaultChecked={true}
            //                 disabled={field.disabled}
            //                 control={
            //                     <Checkbox
            //                         sx={{
            //                             "& .MuiSvgIcon-root": {
            //                                 fontSize: 30,
            //                             },
            //                         }}
            //                         checked={(field.checked === "1" || field.checked === true) ? true : false}
            //                         onChange={field.onChangeFunc}
            //                     />
            //                 }
            //             />
            //         </div>
            //     )
            // }
            if (field.table) {
                return (
                    <div key={key} className={`max-[640px]:col-span-full flex gap-1 mt-2  ${field.style}`}>
                        <Datatable
                            searcher={field.searcher ?? false}
                            data={field.data ?? []}
                            virtual={field.virtual ?? true}
                            columns={field.columns ?? []}
                            {...field}

                        />
                    </div>
                )
            }
            // if (field.slider) {
            //     return (
            //         <div key={key} className={`max-[640px]:col-span-full flex gap-1 mt-2  ${field.style}`}>
            //             <SliderComp
            //                 steps={field.steps}
            //                 label={field.label}
            //                 defaultValue={field.defaultValue}
            //                 onChangeFunc={field.onChangeFunc}
            //                 value={field.value}
            //                 {...field}
            //             />
            //         </div>
            //     )
            // }
            if (field.blankSpace) {
                return (
                    <div key={key} className={`max-[640px]:col-span-full flex gap-1 mt-2 ${field.style}`} />
                )
            }
            if (field.button) {
                return (
                    <div key={key} className={`max-[640px]:col-span-full flex gap-1 ${field.style}`}>
                        <ButtonComp {...field} />
                    </div>
                )
            }
            if (field.childs) {
                return (
                    <div key={key} style={field.styleObj} className={`max-[640px]:col-span-full flex gap-1 mt-2  ${field.style}`}>
                        <FieldDrawer fields={field.childs} />
                    </div>
                )
            }
        })
    )
}