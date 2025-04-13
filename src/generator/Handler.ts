export type Handler = {
  name: string
  methods: Method[]
}

export type Method = {
  methodName: string,
  parameters: string,
  parameters_: string,
  returnType: string,
}
