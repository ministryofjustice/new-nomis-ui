{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "deployment.envs" }}
env:
  - name: API_CLIENT_ID
    valueFrom:
      secretKeyRef:
        name: {{ template "app.name" . }}
        key: API_CLIENT_ID

  - name: API_CLIENT_SECRET
    valueFrom:
      secretKeyRef:
        name: {{ template "app.name" . }}
        key: API_CLIENT_SECRET

  - name: APPINSIGHTS_INSTRUMENTATIONKEY
    valueFrom:
      secretKeyRef:
        name: {{ template "app.name" . }}
        key: APPINSIGHTS_INSTRUMENTATIONKEY

  - name: GOOGLE_TAG_MANAGER_ID
    valueFrom:
      secretKeyRef:
        name: {{ template "app.name" . }}
        key: GOOGLE_TAG_MANAGER_ID

  - name: SESSION_COOKIE_SECRET
    valueFrom:
      secretKeyRef:
        name: {{ template "app.name" . }}
        key: SESSION_COOKIE_SECRET
  - name: REDIS_HOST
    valueFrom:
      secretKeyRef:
        name: dps-redis
        key: REDIS_HOST

  - name: REDIS_PASSWORD
    valueFrom:
      secretKeyRef:
        name: dps-redis
        key: REDIS_PASSWORD        

  - name: API_ENDPOINT_URL
    value: {{ .Values.env.API_ENDPOINT_URL | quote }}

  - name: OAUTH_ENDPOINT_URL
    value: {{ .Values.env.OAUTH_ENDPOINT_URL | quote }}

  - name: NN_ENDPOINT_URL
    value: "https://{{ .Values.ingress.host }}/"

  - name: PRISON_STAFF_HUB_UI_URL
    value: {{ .Values.env.PRISON_STAFF_HUB_UI_URL | quote }}

  - name: KEYWORKER_API_URL
    value: {{ .Values.env.KEYWORKER_API_URL | quote }}

  - name: CASENOTES_API_URL
    value: {{ .Values.env.CASENOTES_API_URL | quote }}

  - name: OMIC_UI_URL
    value: {{ .Values.env.OMIC_UI_URL | quote }}

  - name: ALLOCATION_MANAGER_ENDPOINT_URL
    value: {{ .Values.env.ALLOCATION_MANAGER_ENDPOINT_URL | quote }}

  - name: CATEGORISATION_UI_URL
    value: {{ .Values.env.CATEGORISATION_UI_URL | quote }}

  - name: PATHFINDER_URL
    value: {{ .Values.env.PATHFINDER_URL | quote }}

  - name: MOIC_URL
    value: {{ .Values.env.MOIC_URL | quote }}

  - name: LICENCES_URL
    value: {{ .Values.env.LICENCES_URL | quote }}

  - name: USE_OF_FORCE_URL
    value: {{ .Values.env.USE_OF_FORCE_URL | quote }}

  - name: WHEREABOUTS_URL
    value: {{ .Values.env.WHEREABOUTS_URL | quote }}

  - name: USE_OF_FORCE_PRISONS
    value: {{ .Values.env.USE_OF_FORCE_PRISONS | quote }}

  - name: REMOTE_AUTH_STRATEGY
    value: {{ .Values.env.REMOTE_AUTH_STRATEGY | quote }}

  - name: WEB_SESSION_TIMEOUT_IN_MINUTES
    value: {{ .Values.env.WEB_SESSION_TIMEOUT_IN_MINUTES | quote }}

  - name: HMPPS_COOKIE_NAME
    value: {{ .Values.env.HMPPS_COOKIE_NAME | quote }}

  - name: HMPPS_COOKIE_DOMAIN
    value: {{ .Values.ingress.host | quote }}

  - name: NODE_ENV
    value: production

{{- end -}}
